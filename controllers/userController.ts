import { Request, Response } from "express";

import { prisma } from "../script";

import { addressSchemaDto } from "../validation/user-schema";

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
const getUserInfo = async (req: Request, res: Response) => {
  const {id} = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id:id,
      }
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};
const updateUserInfo = async (req: Request, res: Response) => {
  const {id, name, lastName, username, email} = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id:id,
      },
      data:{
  name:name,
  lastName:lastName,
  username: username,
  email: email,
      }
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const addNewAddress = async (req: Request, res: Response) => {
  try {
    const addressBody = req.body as addressSchemaDto;
    const addressSchema = await prisma.userAddress.create({
      data: addressBody,
    });

    res.status(200).json({
      status: "success",
      data: addressBody,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
    });
  }
};

const updateAddress = async (req: Request, res: Response) => {
  try {
    const addressBody = req.body as addressSchemaDto;
    const addressSchema = await prisma.userAddress.update({
      where: {
        userId: addressBody.userId,
      },
      data: addressBody,
    });

    res.status(200).json({
      status: "success",
      data: addressBody,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
    });
  }
};
const getUserAddressById = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const address = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      status: "success",
      data: address,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
    });
  }
};

export default {
  getUsers,
  addNewAddress,
  updateAddress,
  getUserAddressById,
};
