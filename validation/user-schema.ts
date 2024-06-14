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

export const userSchemaCreate = object({
  body: object({
    name: string().required(),
    lastName: string().required(),
    username: string().required().min(6),
    email: string().email().required(),
    password: string().required().min(8),
  }),
});

export const loginSchema = object({
  body: object({
    username: string().required().min(6),
    password: string().required().min(8),
  }),
});

export type UserSchemaCreateDto = InferType<typeof userSchemaCreate>["body"];
export type userSchemaCreateDto = InferType<typeof userSchemaCreate>["body"];
