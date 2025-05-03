import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';
import { error } from 'console';

export const getActivity = async (req: Request, res: Response) => {

    const {
        activity_id,
        title,
        create_at,
        start_time,
        end_time,
        create_by,

        location_id,
        location_name,

        sport_type_id,
        sport_type_name,
    } = req.body

    let query = ``;

    console.log("activity_id", activity_id)

    query += 'SELECT * FROM activity a \n'
    query += 'LEFT JOIN location l ON l.location_id = a.location_id \n'
    query += 'LEFT JOIN sport_type sp ON sp.sport_type_id = a.sport_type_id \n'
    query += 'LEFT JOIN user_sys us ON us.user_sys_id = a.create_by \n'
    query += 'WHERE a.activity_id > 0 \n'

    if (activity_id) {
        query += `AND a.activity_id = ${activity_id} \n`
    }
    if (title) {
        query += `AND a.title = ${title}  \n`
    }
    if (create_at) {
        query += `AND a.create_at = ${create_at}  \n`
    }
    if (start_time) {
        query += `AND a.start_time = ${start_time}  \n`
    }
    if (end_time) {
        query += `AND a.end_time = ${end_time}  \n`
    }
    if (create_by) {
        query += `AND a.create_by = ${create_by}  \n`
    }
    if (location_id) {
        query += `AND a.location_id = ${location_id}  \n`
    }
    if (location_name) {
        query += `AND l.location_name = ${location_name}  \n`
    }
    if (sport_type_id) {
        query += `AND sp.sport_type_id = ${sport_type_id}  \n`
    }
    if (sport_type_name) {
        query += `AND sp.sport_type_name = ${sport_type_name}  \n`
    }

    console.log(query)


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });

        console.log(data)
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const createActivity = async (req: Request, res: Response) => {

    const {
        title,
        create_at,
        description,
        start_time,
        end_time,
        create_by,
        style,
        location_id,
        sport_type_id,
    } = req.body

    if (
        !title &&
        !create_at &&
        !start_time &&
        !end_time &&
        !create_by &&
        !location_id &&
        !style &&
        !sport_type_id &&
        !description
    ) {
        throw new Error("No value input!");
    }

    if (!title || !create_by || !start_time || !end_time || !style || !location_id || !sport_type_id) {
        // throw new Error("No value input require feild!");
        // return res.status(400).json({
        //     success: false,
        //     errors: [
        //       { message: "Missing required fields" }
        //     ]
        //   });
    }

    const escape = (val: any) => val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;

    const finalCreateDate = create_at || new Date().toISOString(); // 'YYYY-MM-DD'

    let query = ``;

    query += `
    INSERT INTO activity (
        create_by, sport_type_id, location_id, description, start_time, end_time, 
        create_at, title, style
    ) VALUES (
        ${create_by},
        ${sport_type_id},
        ${location_id},
        ${description ? `'${description}'` : ''},
        '${start_time}',
        '${end_time}',
        '${finalCreateDate}', 
        '${title}',
        '${style}'
    )
    RETURNING *;
    `;

    console.log(query)


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};


