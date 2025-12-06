import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import config from "../../config";
import jwt from "jsonwebtoken";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, role, email, phone, password } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  

  const result = await pool.query(
    `INSERT INTO users(name, role, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, role, email, hashedPass, phone]
  );

  return result;
};

const loginUserIntoDB = async (email: string, password: string) => {
  
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);


  if (userData.rows.length === 0) {
    throw new Error("User not found!");
  }
  const user = {id:userData.rows[0].id,name:userData.rows[0].name, email:userData.rows[0].email, phone: userData.rows[0].phone, role:userData.rows[0].role, password:userData.rows[0].password};

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  
  const token = jwt.sign(
    { id:user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  delete user.password;

  return { token, user };
};


export const AuthServices = {
    createUserIntoDB,
    loginUserIntoDB
}