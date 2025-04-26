import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from 'pg';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';

const hashPasswordWithSalt = async (plainPassword: string) => {
  const saltNumber = process.env.SALTNUMBER
  const combined = plainPassword + saltNumber;
  const hashed = await bcrypt.hash(combined, 10);
  return hashed
};

// const users: { id: number; username: string; password: string }[] = [];

export const registerUser = async (req: Request, res: Response) => {

  const {
    email,
    password,
    user_first_name,
    user_last_name,
    sex,
  } = req.body;

  const passwordHasing = await hashPasswordWithSalt(password)
  const username = email.split('@')[0];
  const create_at = new Date().toISOString();

  // เอา email ไปทำ OTP





  // OTP section ถ้าผ่านทำต่อ ถ้าไม่ผ่าน return error

  const query = `
    INSERT INTO user_sys (username, email, password, user_first_name, user_last_name, sex, create_at)
    VALUES ('${username}', '${email}', '${passwordHasing}' , '${user_first_name}' , '${user_last_name}', '${sex}', '${create_at}')
    RETURNING *;
  `;

  console.log("query", query, "\n\n\n")

  try {
    const data = await queryPostgresDB(query, globalSmartGISConfig);
    res.status(200).json({ success: true, data });
} catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Error fetching data' });
}

};



export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
};

