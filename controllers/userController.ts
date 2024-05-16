import { Request, Response } from "express";

import { prisma } from "../script";
import ProductService from "../services/productService";
import { UserSchemaCreateDto } from "../validation/user-schema";

import UserService from "../services/userService";

const addUser = async (req: Request, res: Response) => {
  try {
    let userBody = req.body as UserSchemaCreateDto;
    const hashedPassword = await UserService.hashPassword(userBody.password);
    userBody.password = hashedPassword;
    const user = await prisma.user.create({
      data: userBody,
    });

    res.status(200).json({
      status: "success",
      data: {
        data: userBody,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({
      status: "success",
      count: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

export default {
  addUser,
  getUsers,
};
