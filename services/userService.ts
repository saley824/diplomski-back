import argon2 from "argon2";

const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};
const compare = async (password: string, candidate: string) => {
  return await argon2.verify(password, candidate);
};

export default {
  hashPassword,
  compare,
};
