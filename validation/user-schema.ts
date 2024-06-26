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
    username: string().required().min(4),
    email: string().email().required(),
    password: string().required().min(8),
    confirmPassword: string().oneOf([ref('password')], 'Passwords must match').required(),
  }),
});

export const loginSchema = object({
  body: object({
    username: string().required().min(4),
    password: string().required().min(8),
  }),
});
export const addressSchema = object({
  body: object({
    userId: string().required(),
    country: string().required(),
    city: string().required(),
    streetName: string().required(),
    streetNumber: string().required(),
    postalCode: string().required(),
  }),
});

export type userSchemaCreateDto = InferType<typeof userSchemaCreate>["body"];
export type addressSchemaDto = InferType<typeof addressSchema>["body"];
