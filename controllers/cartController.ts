import { Request, Response } from "express";

import { prisma } from "../script";
import globalHelper from "../helpers/global_helper";
import cartService from "../services/cartService";
import { date } from "yup";

const getCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cart = await cartService.getCart(userId);

    res.status(200).json({
      status: "success",
      count: cart.cartItemsDetails.length,
      totalPrice: cart.totalPrice,
      data: {
        cartItemsDetails: cart.cartItemsDetails,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.body;

    const cartItem = await prisma.cart.create({
      data: {
        productId: productId,
        userId: userId,
        quantity: 1,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        data: cartItem,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const removeCartItem = async (req: Request, res: Response) => {
  const { productId, userId } = req.params;

  try {
    const removedCartItem = await prisma.cart.delete({
      where: {
        productId_userId: {
          productId: productId,
          userId: userId,
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: "Cart item is deleted",
        removedCartItem,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};
const incrementCartItemQuantity = async (req: Request, res: Response) => {
  const isIncrement = req.query.isIncrement;

  const { productId, userId } = req.body;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  const currentCartItem = await prisma.cart.findUnique({
    where: {
      productId_userId: {
        productId: productId,
        userId: userId,
      },
    },
  });

  if (currentCartItem != null && product != null) {
    // if current total amount is 0, and we have product in cart we delete it on try to increment or decrement
    if (product.totalAmount == 0) {
      await prisma.cart.delete({
        where: {
          productId_userId: {
            productId: productId,
            userId: userId,
          },
        },
      });

      res.status(400).json({
        message:
          "There is no anymore this product on stock. It removed from cart",
        status: "fail",
      });
      return;
    }

    if (currentCartItem.quantity == 1 && isIncrement != "true") {
      // case when quantity is 0 and we try to decrement quantity
      res.status(400).json({
        message: "Bad request, quantity cant be 0",
        status: "fail",
      });
      return;
    }

    // case when quantity is equals to total and we try to decrement quantity
    if (
      currentCartItem.quantity == product?.totalAmount &&
      isIncrement == "true"
    ) {
      res.status(400).json({
        message: "There arent enough",
        status: "fail",
      });
      return;
    }

    // case when quantity is greater than total amount. In this case we set quantity on the greatest possible value
    if (currentCartItem.quantity > product?.totalAmount) {
      await prisma.cart.update({
        where: {
          productId_userId: {
            productId: productId,
            userId: userId,
          },
        },
        data: {
          quantity: product?.totalAmount,
        },
      });
      res.status(400).json({
        message:
          "There is not enough amount. Quantity is set to current availability",
        status: "fail",
      });
      return;
    }

    try {
      const cartItem = await prisma.cart.update({
        where: {
          productId_userId: {
            productId: productId,
            userId: userId,
          },
        },
        data: {
          quantity:
            isIncrement == "true"
              ? currentCartItem?.quantity + 1
              : currentCartItem?.quantity - 1,
        },
      });
      res.status(200).json({
        status: "success",
        data: {
          cartItem,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "fail",
      });
    }
  } else {
    res.status(400).json({
      message: "Bad request, cant find item",
      status: "fail",
    });
  }
};

export default {
  getCart,
  addToCart,
  incrementCartItemQuantity,
  removeCartItem,
};
