import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';

export const getUser = async (req: Request, res: Response) => {

    const {
        email,
        user_sys_id,
        username,
        sex,

    } = req.body

    // console.log(req.body)

    let query = ``;

    query += 'SELECT * FROM user_sys us  \n'
    query += 'WHERE 1=1  \n'

    if (user_sys_id) {
        query += `AND us.user_sys_id = ${user_sys_id}  \n`
    }
    if (email){
        query += `AND us.email = '${email}' \n`
    }
    if (username) {
        query += `AND us.username = '${username}'  \n`
    }
    if (sex) {
        query += `AND us.sex = '${sex}' \n`
    }

    console.log(query)


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }

}


export const updateUser = async (req: Request, res: Response) => {
    const {
        user_sys_id,
        email,
        username,
        user_first_name,
        user_last_name,
        sex,
        phone,
        weight,
        height
    } = req.body;

    if (!user_sys_id) {
        res.status(400).json({ success: false, message: "Missing user_sys_id" });
        return
    }

    let fieldsToUpdate = [];

    if (email) fieldsToUpdate.push(`email = '${email}'`);
    if (username) fieldsToUpdate.push(`username = '${username}'`);
    if (user_first_name) fieldsToUpdate.push(`user_first_name = '${user_first_name}'`);
    if (user_last_name) fieldsToUpdate.push(`user_last_name = '${user_last_name}'`);
    if (sex) fieldsToUpdate.push(`sex = '${sex}'`);
    if (phone) fieldsToUpdate.push(`phone = '${phone}'`);
    if (weight !== '') fieldsToUpdate.push(`weight = ${weight}`);
    if (height !== '') fieldsToUpdate.push(`height = ${height}`);

    if (fieldsToUpdate.length === 0) {
        res.status(400).json({ success: false, message: "No fields to update" });
        return
    }

    const query = `
        UPDATE user_sys
        SET ${fieldsToUpdate.join(', ')}
        WHERE user_sys_id = ${user_sys_id}
        RETURNING *;
    `;

    console.log(query);

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
};
