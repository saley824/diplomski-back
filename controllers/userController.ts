import { Request, Response } from "express";

import { prisma } from "../script";
import ProductService from "../services/productService";
import { UserSchemaCreateDto } from "../validation/user-schema";

import UserService from "../services/userService";

import jwt from "jsonwebtoken";

const signToken = (id: String) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpires = process.env.JWT_EXPIRES;
  let token = "";
  if (jwtSecret != undefined) {
    token = jwt.sign(
      {
        id: id,
      },
      jwtSecret,
      {
        expiresIn: jwtExpires,
      }
    );
  }

  return token;
};
const addUser = async (req: Request, res: Response) => {
  try {
    let userBody = req.body as UserSchemaCreateDto;
    const hashedPassword = await UserService.hashPassword(userBody.password);
    userBody.password = hashedPassword;
    const user = await prisma.user.create({
      data: {
        email: userBody.email,
        lastName: userBody.lastName,
        name: userBody.name,
        username: userBody.username,
        password: hashedPassword,
      },
    });
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpires = process.env.JWT_EXPIRES;

    const token = signToken(user.id);
    res.status(200).json({
      status: "success",
      token,
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

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // const hashedPassword = await UserService.hashPassword(password);

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  let isCorrectPassword = false;
  if (user != null) {
    isCorrectPassword = await UserService.compare(user?.password!, password);
  }

  if (!user || !isCorrectPassword) {
    res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
    return;
  }

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export default {
  addUser,
  getUsers,
  login,
};
