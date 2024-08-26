import { NextFunction, Request, Response } from "express";

import { prisma } from "../script";
import ProductService from "../services/productService";
import { userSchemaCreateDto } from "../validation/user-schema";
import crypto from "crypto"
import UserService from "../services/userService";
import ErrorService from "../services/errorService";

import jwt from "jsonwebtoken";
import userService from "../services/userService";
import { Console } from "console";

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
    let userBody = req.body as userSchemaCreateDto;
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

    const token = signToken(user.id);
    res.status(200).json({
      success: true,
      token,
      data: {
        success:true,
        data: userBody,
      },
    });
  } catch (error) {
    ErrorService.handle404(res)
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // const hashedPassword = await UserService.hashPassword(password);

  const user = await prisma.user.findUnique({
    where: {
      username: username,
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
  let isCorrectPassword = false;
  if (user != null) {
    isCorrectPassword = await UserService.compare(user?.password!, password);
  }

  if (!user || !isCorrectPassword) {
    res.status(401).json({
      success: false,
      message: "Incorrect email or password",
    });
    return;
  }

  const token = signToken(user.id);
  res.status(200).json({
    success: true,
    data: {
      user,
      token,
      role: user.isShop ? "Shop" : "User",
    },
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Not find user",
      });
      return;
    }
    const { resetToken, hashResetToken, tokenExpires } =
      userService.createPasswordResetToken();

      console.log(resetToken)
      await prisma.user.update({
        where:{
          email: email,
        },
        data:{
          passwordResetToken:hashResetToken,
          passwordResetExpires: tokenExpires
        }
      })
    // await userService.sendEmail({
    //   email: email,
    //   subject: "Forgot password",
    //   message: resetToken,
    // });
    res.status(200).json({
      success: true,
      message: "Email is sent",
     
    });
  } catch (error) {
    console.log("error")
    ErrorService.handle404(res)
  }
};



const resetPassword = async (req: Request, res: Response) => {
  try {
  const { token, password, confirmPassword } = req.body;

  const hashResetToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  const selectedUser = await prisma.user.findFirst(
    {
      where:{
        passwordResetToken: hashResetToken,
        passwordResetExpires: {
          gte: new Date()
        }
      },
      select:{
        id:true
      }
    }
  )
  if(!selectedUser){
    res.status(400).json({
      success: false,
      message: "Token is invalid or expired",
    });
    return;
  }
  setNewPassword(password, confirmPassword, res, selectedUser.id);

  } catch (error) {
    ErrorService.handle404(res)
  }




};
const changePassword = async (req: Request, res: Response) => {
  try {
  const { oldPassword, password, confirmPassword, userId } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  
  let isCorrectPassword = false;
  if (user != null) {
    isCorrectPassword = await UserService.compare(user?.password!, oldPassword);
  }
  if ( !isCorrectPassword) {
    res.status(401).json({
      success: false,
      message: "Incorrect password",
    });
    return;
  }

  setNewPassword(password, confirmPassword, res, userId);
}catch (error) {
  ErrorService.handle404(res)
}
}
export default {
  addUser,
  login,
  forgotPassword,
  resetPassword,
  changePassword
};





const setNewPassword =  async (password: string, confirmPassword: string,  res: Response, userId : string) => {
  if(password != confirmPassword){
    res.status(400).json({
      success: false,    
      message: "Password do not match",
    });
    return;
  }
  if(password.length < 8){
    res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }
  if(password == confirmPassword){
 
  const hashedPassword = await UserService.hashPassword(password);
   
   await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        password:hashedPassword
      }
    })

    res.status(200).json({
      success: true,
      message: "Password is changed",
    });

    return;
  }
}