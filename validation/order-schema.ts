import { string, object, InferType } from "yup";
import { OrderStatus } from "@prisma/client";

export const changeOrderStatus = object({
  body: object({
    orderId: string().uuid().required(),
    orderStatus: string()
      .oneOf([OrderStatus.FINISHED, OrderStatus.SENT, OrderStatus.REJECTED])
      .required(),
  }),
});

export const order = object({
  body: object({
    userId: string().uuid().required(),
    orderStatus: string().oneOf([
      OrderStatus.NEW,
      OrderStatus.FINISHED,
      OrderStatus.SENT,
      OrderStatus.REJECTED,
    ]),
  }),
});

export type changeOrderStatusDto = InferType<typeof changeOrderStatus>["body"];
export type orderDto = InferType<typeof order>["body"];
