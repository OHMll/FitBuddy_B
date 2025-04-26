import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';

export const getLocation = async (req: Request, res: Response) => {

    const {
        location_id,
        location_name,
        flag_valid,
    } = req.body

    // console.log(req.body)

    let query = ``;

    query += 'SELECT * FROM location l  \n'
    query += 'WHERE l.location_id > 0  \n'

    if (location_id) {
        query += `AND l.location_id = ${location_id}  \n`
    }
    if (location_name) {
        query += `AND l.location_name = ${location_name}  \n`
    }
    if (flag_valid) {
        query += `AND l.flag_valid = ${flag_valid}  \n`
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

export const createLocation = async (req: Request, res: Response) => {
    const {
        location_name,
        lat,
        long,
        remark,
        flag_valid,
    } = req.body;

    if (!location_name || flag_valid === undefined) {
        console.error('Error fetching data:', 'Missing required fields');
        // return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let query = `
        INSERT INTO location (location_name, lat, long, remark, flag_valid)
        VALUES (
            '${location_name}', 
            ${lat},
            ${long},
            ${remark ? `'${remark}'` : 'NULL'},
            ${flag_valid}
        )
        RETURNING *;
    `;

    console.log(query);

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(201).json({ success: true, data });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'Error inserting data' });
    }
};
