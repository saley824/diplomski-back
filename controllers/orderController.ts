import { Request, Response } from "express";

import { prisma } from "../script";
import globalHelper from "../helpers/global_helper";
import cartService from "../services/cartService";
import { date } from "yup";

const makeOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const orderUuid = globalHelper.getUuid();
  const orderItems = [];
  try {
    const cart = await cartService.getCart(userId);

    for (let index = 0; index < cart.cartItemsDetails.length; index++) {
      const cartItem = cart.cartItemsDetails[index];
      if (cartItem.quantity > cartItem.totalAmount) {
        res.status(200).json({
          status: "fail",
          data: {
            message: "There aren't enough quantity of product " + cartItem.name,
          },
        });
        return;
      }

      orderItems.push({
        orderId: orderUuid,
        name: cartItem.name,
        quantity: cartItem.quantity,
        totalAmount: cartItem.totalAmount,
        price: cartItem.price,
        productId: cartItem.productId,
      });
    }

    await prisma.order.create({
      data: {
        id: orderUuid,
        userId: userId,
        totalPrice: cart.totalPrice,
      },
    });

    await prisma.orderItem.createMany({
      data: orderItems.map((order) => ({
        orderId: orderUuid,
        name: order.name,
        quantity: order.quantity,
        price: order.price,
        productId: order.productId,
      })),
    });

    for (let index = 0; index < orderItems.length; index++) {
      const cartItem = orderItems[index];
      await prisma.product.update({
        where: {
          id: cartItem.productId,
        },
        data: {
          totalAmount: cartItem.totalAmount - cartItem.quantity,
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "Order is successfully made",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
    });
  }
};

const getOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json({
      status: "success",
      count: order.length,
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

export default {
  makeOrder,
  getOrders,
};
