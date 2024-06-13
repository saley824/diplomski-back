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

// product   Product @relation(fields: [productId], references: [id])
// productId String
// user      User    @relation(fields: [userId], references: [id])
//     String
// rating    Int
// comment   String?
export const reviewSchemaCreate = object({
  body: object({
    productId: string().uuid().required(),
    userId: string().uuid().required(),
    comment: string(),
    rating: number().required().min(1).max(5),
  }),
});

export type reviewSchemaCreateDto = InferType<
  typeof reviewSchemaCreate
>["body"];
