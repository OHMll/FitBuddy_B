import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';
import { error } from 'console';

export const getPlanningDay = async (req: Request, res: Response) => {

    const {
        planning_day_id,
        sport_type_id,
        currentdate,
        start_time,
        duration,
        title,
        type,
        status,
        planning_create_by,
    } = req.body

    let query = ``;

    query += 'SELECT * FROM planning_day pd \n'
    query += 'LEFT JOIN sport_type sp ON sp.sport_type_id = pd.sport_type_id \n'
    query += 'WHERE pd.planning_day_id > 0 \n'

    if (planning_day_id) {
        query += `AND pd.planning_day_id = ${planning_day_id}  \n`
    }
    if (sport_type_id) {
        query += `AND sp.sport_type_id = ${sport_type_id}  \n`
    }
    if (currentdate) {
        query += `AND pd.currentdate = ${currentdate}  \n`
    };
    if (start_time) {
        query += `AND pd.start_time = ${start_time}  \n`
    };
    if (duration) {
        query += `AND pd.duration = ${duration}  \n`
    };
    if (title) {
        query += `AND pd.title = ${title}  \n`
    };
    if (status) {
        query += `AND pd.status = ${status}  \n`
    };
    if (planning_create_by) {
        query += `AND pd.planning_create_by = ${planning_create_by}  \n`
    };
    if (type) {
        query += `AND pd.type = ${type}  \n`
    };

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

export const createPlanningDay = async (req: Request, res: Response) => {

    const {
        currentdate,
        start_time,
        duration,
        title,
        type,
        status,
        planning_create_by,
    } = req.body

    if (
        !currentdate &&
        !start_time &&
        !duration &&
        !title &&
        !type &&
        !status &&
        !planning_create_by
    ) {
        throw new Error("No value input!");
    }

    const escape = (val: any) => val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;


    let query = ``;

    query += `
    INSERT INTO planning_week (
        currentdate, start_time, duration, title, type, status, planning_create_by
    ) VALUES (
        '${currentdate}',
        '${start_time}',
        ${duration},
        '${title}',
        '${type}',
        ${status},
        ${planning_create_by},
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