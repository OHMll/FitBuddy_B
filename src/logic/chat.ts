import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';
import { error } from 'console';



export const getChatSystem = async (req: Request, res: Response) => {

    const {
        message_id,
        conversation_id,
        send_by,
        send_at,
        message_text
    } = req.body

    // console.log(req.body)

    let query = ``;

    query += 'SELECT * FROM message ms  \n'
    query += 'WHERE 1=1  \n'

    if (message_id) {
        query += `AND ms.message_id = ${message_id}  \n`
    }
    if (conversation_id) {
        query += `AND ms.conversation_id = ${conversation_id}  \n`
    }
    if (send_by) {
        query += `AND ms.send_by = ${send_by}  \n`
    };

    if (message_text) {
        query += `AND ms.message_text = ${message_text}  \n`
    };

    console.log(query)


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }

}