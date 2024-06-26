import { NextFunction, Request, Response } from "express";



const handleError = async (res: Response, message:Text, statusCode: number, success: boolean) => {
    res.status(statusCode).json({
        success: success,
        message: "message",
      });;
  };

const handle404 = async (res: Response,) => {
    
    res.status(404).json({
        success: false,
        message: "Error",
      });;
  };

  export default {
    handleError,
    handle404,

  };