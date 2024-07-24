import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";

import { prisma } from "../script";
import globalHelper from "../helpers/global_helper";
import cartService from "../services/cartService";
import { changeOrderStatusDto, orderDto } from "../validation/order-schema";
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
          success:false,
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
        totalPrice:cartItem.cartItemTotalPrice,
        discountedPrice: cartItem.discountedPrice,
        image: cartItem.image,
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
        totalPrice:order.totalPrice,
        discountedPrice:order.discountedPrice,
        img: order.image,
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
      success:true,
      data: {
        message: "Order is successfully made",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success:false,
    });
  }
};

const getOrders = async (req: Request, res: Response) => {
  const body = req.body as orderDto;

  try {
    const order = await prisma.order.findMany({
      where: {
        userId: body.userId,
        status: body.orderStatus,
      },
    });
    res.status(200).json({
      success:true,
      count: order.length,
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(404).json({
      success:false,
    });
  }
};
const changeOrderStatus = async (req: Request, res: Response) => {
  const changeOrderStatus = req.body as changeOrderStatusDto;

  try {
    if (changeOrderStatus.orderStatus == "SENT") {
    }
    const oldOrder = await prisma.order.findFirst({
      where: {
        id: changeOrderStatus.orderId,
      },
    });
    const changedOrder = await prisma.order.update({
      where: {
        id: changeOrderStatus.orderId,
      },
      data: {
        status: changeOrderStatus.orderStatus,
        sentTime:
          changeOrderStatus.orderStatus == "SENT"
            ? new Date()
            : oldOrder?.sentTime,
        finishedTime:
          changeOrderStatus.orderStatus == "FINISHED"
            ? new Date()
            : oldOrder?.finishedTime,
        rejectedTime:
          changeOrderStatus.orderStatus == "REJECTED"
            ? new Date()
            : oldOrder?.rejectedTime,
      },
    });
    res.status(200).json({
      success:true,
      message: "Status is successfully changed",
      data: {
        changedOrder,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success:false,
    });
  }
};
export default {
  makeOrder,
  getOrders,
  changeOrderStatus,
};
