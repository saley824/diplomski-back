import { ProductDiscount } from "@prisma/client";
import { prisma } from "../script";
import { boolean } from "yup";

//TODO
const checkIfProductHasDiscount = (
  productDiscount: ProductDiscount
): boolean => {
  let isDiscountActive: boolean = false;
  let currentDate: Date = new Date();
  if (currentDate >= productDiscount.from && currentDate < productDiscount.to) {
    isDiscountActive = true;
  }
  return isDiscountActive;
};

const sort = (sort: string, orderBy: string) => {
  if (sort == "price")
    return {
      price: orderBy,
    };
  if (sort == "createdAt")
    return {
      createdAt: orderBy,
    };
};

function applyDiscount(price: number, discount: number = 0.05): number {
  return price * (1 - discount);
}

// const test = async (options: { searchTerm: string \\ }) => {};
const getProductsByFilters = async (options: {
  filterObject: any;
  page: number;
  perPage: number;
}) => {
  const { filterObject, page, perPage } = options;
  let sort: any = {};
  let hasDiscount: boolean = false;
  let categoryId: string | null = null;
  let superCategoryId: string | null = null;
  let searchTerm: string | null = null;

  let sortBy: string = filterObject.sortBy?.toString();
  let orderBy: string = filterObject.orderBy?.toString();
  sort[sortBy] = orderBy;

  console.log(filterObject);
  if (filterObject.categoryId) {
    categoryId = filterObject.categoryId.toString();
  }
  if (filterObject.superCategoryId) {
    superCategoryId = filterObject.superCategoryId.toString();
  }
  if (filterObject.searchTerm) {
    searchTerm = filterObject.searchTerm.toString();
  }
  if (filterObject.hasDiscount) {
    hasDiscount = filterObject.hasDiscount == "true" ? true : false;
  }
  const categories = await prisma.category.findMany({
    where: {
      superCategoryId: superCategoryId,
    },
    select: {
      id: true,
    },
  });

  const skip = (page - 1) * perPage;

  const categoryIds = categories.map((e) => e.id);
  const products = await prisma.product.findMany({
    skip: skip,
    take: perPage + 1,
    where: {
      totalAmount:{
        gt: 0
      },
      name: searchTerm
        ? {
            contains: searchTerm,
            mode: "insensitive",
          }
        : {},

      NOT: hasDiscount
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
            gte:
              filterObject.price.gte != null
                ? Number(filterObject.price.gte)
                : undefined,
            lte:
              filterObject.price.lte != null
                ? Number(filterObject.price.lte)
                : undefined,
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
    orderBy: sortBy == "discount" ?
    [
      {
        productDiscount : {
          percentage: orderBy
        },
      }
    ]
    :sort
    ,
  });
  let hasNext: boolean = products.length > perPage;
  if (hasNext) {
    products.pop();
  }
  return { hasNext, products };
};

export default {
  checkIfProductHasDiscount,
  sort,
  getProductsByFilters,
};
