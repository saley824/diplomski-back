import { Request, Response } from "express";

import { prisma } from "../script";
import {
  productSchemaCreateDto,
  ProductSortsSchemaDto,
} from "../validation/product-schema";

import productService from "../services/productService";

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
          success:true,

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
     
        productDiscount:true
        ,
        productPriceHistory: {
          select: {
            newPrice: true,
            changeDate: true,
          },
        },
        category:{
        
          select:{
            name:true,
            id:true,
            superCategory:true,
           
          }

        }
      },
    });


    


    const result = await prisma.review.aggregate({
      where: {
        productId: req.params.id,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    if (product.productDiscount != null) {
      let success: boolean = productService.checkIfProductHasDiscount(product.productDiscount);
      if(!success){
        product["productDiscount"].hasDiscount = false;
          }
           
            product["discountedPrice"] = parseFloat( ( (product.price*1 * (100 - product.productDiscount.percentage*1)) / 100 ).toFixed(2))
          
   
      
      ;
    }

    product["avgReview"] = result._avg.rating != null ? Math.round(result._avg.rating * 100) / 100  : null ;
    product["countReview"] = result._count.rating;


    // if (product == null) {
    // }
    // check discount
    res.status(200).json({
            success:true,

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
  // let sort: any = {};
  let filterObject: any = {};

  filterObject = req.query;

  // --------------SORT-------------------------------
  if (filterObject.sortBy && filterObject.orderBy) {
    // let sortBy: string = filterObject.sortBy?.toString();
    // let orderBy: string = filterObject.orderBy?.toString();
    // sort[sortBy] = orderBy;
  }

  let page: number = 1;
  let perPage: number = 100;
  if (filterObject.page && filterObject.perPage) {
    page = filterObject.page * 1;
    perPage = filterObject.perPage * 1;
  } else {
    res.status(404).json({
      success:false,
      message: "dje ti je paginacija",
      status: "fail",
    });
  }

  try {
    const { hasNext, products } = await productService.getProductsByFilters({
      filterObject: filterObject,
      page: page,
      perPage: perPage,
    });
    
    let returnProducts : any [] = [];


    for (let i = 0; i < products.length; i++) {
      let productTemp: any = {};
      
      productTemp = products[i];
      const review = await prisma.review.aggregate({
        where: {
          productId: products[i].id,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });
       
      productTemp["avgReview"] =  review._avg.rating != null ? Math.round(review._avg.rating * 100) / 100  : null ;
      
      productTemp["countReview"] = review._count.rating;


    if (productTemp["productDiscount"] != null)
    {

       let success: boolean = productService.checkIfProductHasDiscount(productTemp.productDiscount);

       if(!success){
        productTemp["productDiscount"] = null;
        productTemp["discountedPrice"] = null;
       }
       else {
        productTemp["discountedPrice"] =  productTemp["productDiscount"] != null ?  parseFloat(((productTemp["price"]*1 * (100 - productTemp["productDiscount"].percentage*1)) / 100).toFixed(2))    : null 

       }

    }

      returnProducts.push(productTemp)
    }

    res.status(200).json({
      
      success:true,
   
      data: {
        hasNext: hasNext,
        count: products.length,
       products: returnProducts,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(404).json({
      success:false,
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
      success:true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success:false,
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
            success:true,

      data: {
        data: productBody,
      },
    });
  } catch (error) {
    res.status(404).json({
      success:false,
      status: "fail",
    });
  }
};
const test = ( )=> {
  return true;
};



//DELETE

// const deleteAllProducts = async (req: Request, res: Response) => {
//   try {
//     const category = await prisma.category.deleteMany({});
//     res.status(200).json({
//       success:true,

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
    //delete product price history
    await prisma.productPriceHistory.deleteMany({
      where: {
        productId: req.params.id,
      },
    });
    //delete product discount
    await prisma.productDiscount.deleteMany({
      where: {
        productId: req.params.id,
      },
    });
    //delete saved product
    await prisma.savedProducts.deleteMany({
      where: {
        productId: req.params.id,
      },
    });
    //delete order item
    await prisma.orderItem.deleteMany({
      where: {
        productId: req.params.id,
      },
    });
    //delete review
    await prisma.review.deleteMany({
      where: {
        productId: req.params.id,
      },
    });
    // delete product from cart
    await prisma.cart.deleteMany({
      where: {
        productId: req.params.id,
      },
    });
    const deletedProduct = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
            success:true,

      data: {
        message: "Deleted",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success:false,
     
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
