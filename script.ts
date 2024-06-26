import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import categoryRouter from "./routes/categoryRoutes";
import productRouter from "./routes/productRoutes";
import productDiscountRouter from "./routes/productDiscountRoutes";
import userRouter from "./routes/userRoutes";
import savedProducts from "./routes/savedProductsRoutes";
import cartRouter from "./routes/cartRoutes";
import orderRouter from "./routes/orderRoutes";
import homeRouter from "./routes/homeRoute";
import reviewRouter from "./routes/reviewRoutes";

import dotenv from "dotenv";
dotenv.config();
// import PostRouter from "./routes/blog.route";

// export const prisma = new PrismaClient().$extends({
//   result: {
//     product: {
//       discountedPrice: {
//         needs: { price: true },
//         compute(product) {
//           return product.price * 0.7;
//         },
//       },
//     },
//   },
// });

export const prisma = new PrismaClient();

// import app from "./app";
const app = express();

const port = 3000;

async function main() {
  app.use(express.json());

  // Register API routes
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/productDiscount", productDiscountRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/saved_products", savedProducts);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/home", homeRouter);
  app.use("/api/v1/reviews", reviewRouter);
  // app.use(express.json());

  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
  // Register API routes
  // app.use("/api/v1/post", PostRouter);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
