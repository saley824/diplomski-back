import {
  string,
  object,
  number,
  boolean,
  date,
  ref,
  InferType,
  mixed,
  array,
} from "yup";
import { Unit } from "@prisma/client";

export const productSchemaCreate = object({
  body: object({
    categoryId: string().uuid().required(),
    name: string().required(),
    description: string().min(12).required(),
    price: number().required(),
    totalAmount: number().integer().required(),
    unit: string().oneOf([Unit.KG, Unit.LITER, Unit.PIECE]).required(),
    quantity: number(),
  }),
});
export const productSchemaUpdate = object({
  body: object({
    categoryId: string().uuid().required(),
    name: string().required(),
    description: string().min(12).required(),
    price: number().required(),
    totalAmount: number().integer().required(),
    unit: string().oneOf([Unit.KG, Unit.LITER, Unit.PIECE]).required(),
    quantity: number(),
  }),
});

export const productDiscountSchemaCreate = object({
  body: object({
    productId: string().uuid().required(),
    from: date().required(),
    to: date().required(),
    percentage: number().integer().min(0).max(100).required(),
  }),
});

export const productDiscountSchemaUpdate = object({
  body: object({
    from: date().required(),
    to: date().required(),
    percentage: number().integer().min(0).max(100).required(),
  }),
});

export const productSortsSchema = object({
  body: object({
    displayName: string().required(),
    sortBy: string().required(),
    orderBy: string().required(),
  }),
});

export type productSchemaCreateDto = InferType<
  typeof productSchemaCreate
>["body"];
export type productSchemaUpdateDto = InferType<
  typeof productSchemaUpdate
>["body"];
export type productDiscountSchemaCreateDto = InferType<
  typeof productDiscountSchemaCreate
>["body"];
export type productDiscountSchemaUpdateDto = InferType<
  typeof productDiscountSchemaUpdate
>["body"];
export type ProductSortsSchemaDto = InferType<
  typeof productSortsSchema
>["body"];
