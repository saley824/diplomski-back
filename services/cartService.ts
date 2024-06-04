import { prisma } from "../script";
import globalHelper from "../helpers/global_helper";

const getCart = async (userId: string | undefined) => {
  const cartItems = await prisma.cart.findMany({
    where: {
      userId,
    },
  });

  const cartItemsDetails: {
    name: string;
    productId: string;
    quantity: number;
    price: number;
    totalAmount: number;
    cartItemTotalPrice: number;
    discountedPrice: number | null;
  }[] = [];
  let totalPrice: number = 0;
  let cartItemTotalPrice: number = 0;
  for (let index = 0; index < cartItems.length; index++) {
    const item = cartItems[index];
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
      select: {
        id: true,
        price: true,
        name: true,
        totalAmount: true,
        productDiscount: {
          select: {
            percentage: true,
            from: true,
            to: true,
          },
        },
      },
    });
    if (product != null) {
      let discountedPrice: number | null =
        product.productDiscount != null
          ? globalHelper.calculateDiscount(
              product.price,
              product.productDiscount.percentage
            )
          : null;
      if (discountedPrice != null) {
        cartItemTotalPrice += discountedPrice * item.quantity;
      } else {
        cartItemTotalPrice += product.price * item.quantity;
      }

      cartItemsDetails.push({
        name: product.name,
        productId: product.id,
        quantity: item.quantity,
        totalAmount: product.totalAmount,
        price: product?.price,
        discountedPrice: discountedPrice,
        cartItemTotalPrice,
      });
      totalPrice += cartItemTotalPrice;
      cartItemTotalPrice = 0;
    }
  }

  return { cartItemsDetails, totalPrice };
};

export default {
  getCart,
};
