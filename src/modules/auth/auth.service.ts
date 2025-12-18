import config from "../../config";
import { pool } from "../../config/db";
import jwt = require("jsonwebtoken");
import bcrypt from "bcryptjs";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password,phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [name, email, hashedPass, phone, role]
  );
  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1 `, [
    email,
  ]);
  const user = result.rows[0];

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { success: false, message: "Wrong password, try again" };
  }

  const secret = config.jwtSecret as string;

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    secret,
    {
      expiresIn: "7d",
    }
  );
  delete user.password;
  return { token, user };
};

export const authService = {
  signupUser,
  loginUser,
};
