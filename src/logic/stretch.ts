import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';

export const getStretch = async (req: Request, res: Response) => {

    const {
        stretch_id,

        sport_type_id,
        sport_type_name,

        flag_valid,
        image,
    } = req.body

    // console.log(req.body)

    let query = ``;

    query += 'SELECT * FROM stretch s  \n'
    query += 'LEFT JOIN sport_type sp ON sp.sport_type_id = s.sport_type_id \n'
    query += 'WHERE s.stretch_id > 0  \n'

    if (stretch_id) {
        query += `AND s.stretch_id = ${stretch_id}  \n`
    }
    if (sport_type_id) {
        query += `AND s.sport_type_id = ${sport_type_id}  \n`
    }
    if (sport_type_name) {
        query += `AND s.sport_type_name = ${sport_type_name}  \n`
    }
    if (flag_valid) {
        query += `AND s.flag_valid = ${flag_valid}  \n`
    }
    if (image) {
        query += `AND s.image = ${image}  \n`
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
