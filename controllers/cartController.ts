import { Request, Response } from "express";

import { prisma } from "../script";

const getCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  console.log(userId);

  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId,
      },
    });
    res.status(200).json({
      status: "success",
      count: cartItems.length,
      data: {
        cartItems,
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
    if (currentCartItem.quantity > product?.totalAmount) {
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
