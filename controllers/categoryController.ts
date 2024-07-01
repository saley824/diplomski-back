import { Request, Response } from "express";
import { prisma } from "../script";

//FINISHED
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

//FINISHED
const getAllSubCategoriesById = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        superCategoryId: req.params.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};

//FINISHED
const getAllSuperCategories = async (req: Request, res: Response) => {
  
  try {
    const categories = await prisma.category.findMany({
      where: {
        superCategoryId: null,
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};

const addNewCategory = async (req: Request, res: Response) => {
  const { name, superCategoryId } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name: name,
        superCategoryId: superCategoryId,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        superCategoryId,
        name,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { name, id, superCategoryId } = req.body;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        superCategoryId: superCategoryId,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        message: "Proslo",
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};
const deleteAllCategories = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.deleteMany({});
    res.status(200).json({
      success: true,
      data: {
        message: "Deleted",
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: "fail",
    });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  getAllSuperCategories,
  addNewCategory,
  getAllSubCategoriesById,
  updateCategory,
  deleteAllCategories,
};
