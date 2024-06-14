import { Request, Response } from "express";

import { prisma } from "../script";

const saveProduct = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.body;
    console.log(productId);
    const savedProduct = await prisma.savedProducts.create({
      data: {
        productId: productId,
        userId: userId,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        data: savedProduct,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};
const getSavedProducts = async (req: Request, res: Response) => {
  try {
    const savedProducts = await prisma.savedProducts.findMany({});
    res.status(200).json({
      status: "success",
      count: savedProducts.length,
      data: {
        savedProducts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const getSavedProductsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const savedProducts = await prisma.savedProducts.findMany({
      where: {
        userId,
      },
    });
    res.status(200).json({
      status: "success",
      count: savedProducts.length,
      data: {
        savedProducts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const deleteSavedProduct = async (req: Request, res: Response) => {
  const { productId, userId } = req.params;

  try {
    const deletedProduct = await prisma.savedProducts.delete({
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
        message: "Saved Product is deleted",
        deletedProduct,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const checkIfUserSavedProduct = async (req: Request, res: Response) => {
  const { productId, userId } = req.params;

  try {
    const savedProduct = await prisma.savedProducts.findUnique({
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
        isSaved: savedProduct != null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
    });
  }
};

export default {
  saveProduct,
  getSavedProducts,
  deleteSavedProduct,
  getSavedProductsByUserId,
  checkIfUserSavedProduct,
};
