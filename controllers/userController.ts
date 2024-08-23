import { Request, Response } from "express";

import { prisma } from "../script";

import { addressSchemaDto } from "../validation/user-schema";
import { Console } from "console";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({
       success: true,
      count: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
    });
  }
};
const getUserInfo = async (req: Request, res: Response) => {
  const {id} = req.params;
  console.log(id)
  try {
    const user = await prisma.user.findUnique({
      where: {
        id:id,
      },
      select:{
        id:true,
        name:true,
        lastName:true,
        email:true,
        username:true,
        isShop:true,
        password:true
      }
    });
    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
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
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
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
       success: true,
      data: addressBody,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
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
       success: true,
      data: addressBody,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};
const getUserAddressById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const address = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
       success: true,
      data: address,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
    });
  }
};

export default {
  getUsers,
  addNewAddress,
  updateAddress,
  getUserAddressById,
  getUserInfo
};
