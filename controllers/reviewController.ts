import { Request, Response } from "express";

import { prisma } from "../script";
import productService from "../services/productService";

const makeReview = async (req: Request, res: Response) => {};

const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany();
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
