import { Request, Response } from "express";

import { prisma } from "../script";
import productService from "../services/productService";
import { reviewSchemaCreateDto } from "../validation/review-schema";

const makeReview = async (req: Request, res: Response) => {
  const reviewBody = req.body as reviewSchemaCreateDto;

  try {
    await prisma.review.create({
      data: reviewBody,
    });
    res.status(200).json({
      success: true,
      data: reviewBody,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  const productId = req.body.productId;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};

const getAllReviewsByUserId = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};
const isUserRatedProduct = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    const result = await prisma.review.aggregate({
      where: {
        productId: productId,
        userId: userId,
      },
      _count: {
        rating: true,
      },
    });
    const result2 = await prisma.review.findFirst({
      where: {
        productId: productId,
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: result2,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};

export default {
  makeReview,
  getAllReviews,
  getAllReviewsByUserId,
  isUserRatedProduct,
};
