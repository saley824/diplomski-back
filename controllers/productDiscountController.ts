import { Request, Response } from "express";

import { prisma } from "../script";
import {
  productDiscountSchemaCreateDto,
  productDiscountSchemaUpdateDto,
} from "../validation/product-schema";

//TODO maybe use middleware to check is there discount for some product

// const checkDiscount = async (req: Request, res: Response, next: any) => {};

// DISCOUNT SECTION

const addProductDiscount = async (req: Request, res: Response) => {
  try {
    const productDiscountBody = req.body as productDiscountSchemaCreateDto;
    const productDiscount = await prisma.productDiscount.create({
      data: productDiscountBody,
    });
    res.status(200).json({
      status: "success",
      data: {
        data: productDiscount,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};
const updateProductDiscount = async (req: Request, res: Response) => {
  try {
    const productDiscountBody = req.body as productDiscountSchemaUpdateDto;
    const id = req.params.id;
    const productDiscount = await prisma.productDiscount.update({
      where: {
        productId: id,
      },
      data: productDiscountBody,
    });
    res.status(200).json({
      status: "success",
      data: {
        data: productDiscount,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const deleteProductDiscountById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product = await prisma.productDiscount.delete({
      where: {
        productId: req.params.id,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        message: "Product discount deleted",
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

export default {
  addProductDiscount,
  updateProductDiscount,
  deleteProductDiscountById,
};
