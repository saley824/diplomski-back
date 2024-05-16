import { Request, Response } from "express";

import { prisma } from "../script";
import {
  productSchemaCreateDto,
  ProductSortsSchemaDto,
} from "../validation/product-schema";

//TODO maybe use middleware to check is there discount for some product

// const checkDiscount = async (req: Request, res: Response, next: any) => {};

const getProductSorts = async (req: Request, res: Response) => {
  let sorts: Array<ProductSortsSchemaDto> = [
    {
      displayName: "Price ascending",
      sortBy: "price",
      orderBy: "asc",
    },
    {
      displayName: "Price descending",
      sortBy: "price",
      orderBy: "desc",
    },
    {
      displayName: "Publish date ascending",
      sortBy: "createdAt",
      orderBy: "asc",
    },
    {
      displayName: "Publish date descending",
      sortBy: "createdAt",
      orderBy: "desc",
    },
  ];

  res.status(200).json({
    status: "success",
    sorts: {
      sorts,
    },
  });
};
const getProductById = async (req: Request, res: Response) => {
  let product: any = {};
  try {
    product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        productDiscount: {
          select: {
            percentage: true,
            from: true,
            to: true,
          },
        },
        ProductPriceHistory: {
          select: {
            newPrice: true,
            changeDate: true,
          },
        },
      },
    });

    if (product.productDiscount != null) {
      product["discountedPrice"] =
        (product.price * (100 - product.productDiscount.percentage)) / 100;
    }

    // if (product == null) {
    // }
    // check discount
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  let sort: any = {};
  let price: any = {};
  let filterObject: any = {};
  filterObject = req.query;

  console.log(filterObject);
  // --------------SORT-------------------------------
  if (filterObject.sortBy && filterObject.orderBy) {
    let sortBy: string = filterObject.sortBy?.toString();
    let orderBy: string = filterObject.orderBy?.toString();
    sort[sortBy] = orderBy;
  }
  //---------------FILTER--------------------------

  let hasDiscountFilter: boolean = false;
  let categoryId: string | null = null;
  let superCategoryId: string | null = null;
  let searchTerm: string | null = null;

  if (filterObject.hasDiscount == "true") {
    hasDiscountFilter = true;
  }
  if (filterObject.categoryId) {
    categoryId = filterObject.categoryId.toString();
  }
  if (filterObject.superCategoryId) {
    superCategoryId = filterObject.superCategoryId.toString();
  }
  if (filterObject.searchTerm) {
    searchTerm = filterObject.searchTerm.toString();
  }

  const categories = await prisma.category.findMany({
    where: {
      superCategoryId: superCategoryId,
    },
    select: {
      id: true,
    },
  });

  const categoryIds = categories.map((e) => e.id);

  try {
    const products = await prisma.product.findMany({
      where: {
        name: searchTerm
          ? {
              startsWith: searchTerm,
              mode: "insensitive",
            }
          : {},

        NOT: hasDiscountFilter
          ? {
              productDiscount: null,
            }
          : {},
        categoryId: categoryId
          ? categoryId
          : superCategoryId
          ? { in: categoryIds }
          : {},
        price: filterObject.price
          ? {
              gte: Number(filterObject.price.gte),
              lte: Number(filterObject.price.lte),
            }
          : {},
      },
      include: {
        productDiscount: {
          select: {
            percentage: true,
            from: true,
            to: true,
          },
        },
      },
      orderBy: sort,
    });
    res.status(200).json({
      status: "success",
      count: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const addNewProduct = async (req: Request, res: Response) => {
  try {
    const productBody = req.body as productSchemaCreateDto;

    const product = await prisma.product.create({
      data: productBody,
    });

    await prisma.productPriceHistory.create({
      data: {
        productId: product.id,
        newPrice: product.price,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        data: productBody,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

const updateProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const productBody = req.body as productSchemaCreateDto;

    const product = await prisma.product.findFirst({
      where: {
        id: id,
      },
    });

    if (product != null) {
      let currentPrice: number = product?.price;
      let newPrice: number = productBody.price;
      //We check is price changed
      if (currentPrice != newPrice) {
        await prisma.productPriceHistory.create({
          data: {
            productId: id,
            newPrice: newPrice,
          },
        });
      }
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: productBody,
    });
    res.status(200).json({
      status: "success",
      data: {
        data: productBody,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

//DELETE

// const deleteAllProducts = async (req: Request, res: Response) => {
//   try {
//     const category = await prisma.category.deleteMany({});
//     res.status(200).json({
//       status: "success",
//       data: {
//         message: "Deleted",
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//     });
//   }
// };

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        message: "Deleted",
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

export default {
  addNewProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductSorts,
};
