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
      status: "success",
      data: reviewBody,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
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
      status: "success",
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
    });
  }
};

// const getAllReviewsByProductId = async (req: Request, res: Response) => {
//   const reviews = await prisma.product.findMany({
//     include: {
//       Reviews: true,
//     },
//   });
// };

const getAllReviewsByUserId = async (req: Request, res: Response) => {
  const reviews = await prisma.user.findMany({
    include: {
      Reviews: true,
    },
  });
};

export default {
  makeReview,
  getAllReviews,
  getAllReviewsByUserId,
};
