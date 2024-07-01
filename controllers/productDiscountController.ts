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
  console.log("uslo")
  try {
    const productDiscountBody = req.body as productDiscountSchemaCreateDto;
    const productDiscount = await prisma.productDiscount.create({
      data: {
productId :productDiscountBody.productId,
percentage:productDiscountBody.percentage,
from:  new Date(productDiscountBody.from),
to:  new Date(productDiscountBody.to),
      }
    });
    res.status(200).json({
      success: true,
      data: {
        data: productDiscount,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(404).json({
      success: false,
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
      data: {
        percentage:productDiscountBody.percentage,
        from:  new Date(productDiscountBody.from),
        to:  new Date(productDiscountBody.to),
              }
    });
    res.status(200).json({
      success: true,
      data: {
        data: productDiscount,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
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
      success: true,
      data: {
        message: "Product discount deleted",
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};

export default {
  addProductDiscount,
  updateProductDiscount,
  deleteProductDiscountById,
};
