import { ProductDiscount } from "@prisma/client";

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

export default {
  checkIfProductHasDiscount,
  sort,
};
