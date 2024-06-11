import { Request, Response } from "express";

import { prisma } from "../script";
import productService from "../services/productService";


const getDiscountedProducts = async (req: Request, res: Response) => {

    let sort: any = {};

    const filterObject : any = {
        hasDiscount:"true"
    };

    const { hasNext, products } = await productService.getProductsByFilters({
        filterObject:filterObject,
        sort: sort,
        page: 1,
        perPage: 10,
    
      });

      res.status(200).json({
        hasNext: hasNext,
        status: "success",
        count: products.length,
        data: {
          products,
        },
      });
    
}


export default {
    getDiscountedProducts
}