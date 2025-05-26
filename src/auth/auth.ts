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

function generateDefaultAvatar(letter: any) {
  const svg = `
  <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#4F46E5"/>
    <text x="50%" y="50%" font-size="64" fill="white" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif">
      ${letter}
    </text>
  </svg>
  `;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

export const registerUser = async (req: Request, res: Response) => {

  const {
    email,
    password,
    user_first_name,
    user_last_name,
    sex,
    phone,
    weight,
    height
  } = req.body;

  const passwordHasing = await hashPasswordWithSalt(password)
  const username = email.split('@')[0];
  const create_at = new Date().toISOString();
  const firstChar = user_first_name.trim().charAt(0).toUpperCase();
  const avatar_url = generateDefaultAvatar(firstChar);

  const query = `
    INSERT INTO user_sys (username, email, password, user_first_name, user_last_name, avatar_url, create_at, sex, phone, weight, height)
    VALUES ('${username}', '${email}', '${passwordHasing}' , '${user_first_name}' , '${user_last_name}', '${avatar_url}', '${create_at}', '${sex}', '${phone}', ${weight}, ${height})
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

