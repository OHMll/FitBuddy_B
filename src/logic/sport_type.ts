import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';

export const getSportType = async (req: Request, res: Response) => {

    const {
        sport_type_id,
        sport_type_name,
        flag_valid,
    } = req.body

    // console.log(req.body)

    let query = ``;

    query += 'SELECT * FROM sport_type sp  \n'
    query += 'WHERE sp.sport_type_id > 0  \n'

    if (sport_type_id) {
        query += `AND sp.sport_type_id = ${sport_type_id}  \n`
    }
    if (sport_type_name) {
        query += `AND sp.sport_type_name = ${sport_type_name}  \n`
    }
    if (flag_valid) {
        query += `AND sp.flag_valid = ${flag_valid}  \n`
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