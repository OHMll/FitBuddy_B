import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';
import { error } from 'console';

export const getPlanningWeek= async (req: Request, res: Response) => {

    const {
        planning_week_id,
        start_date,
        end_date,
        exercise_count,
        exercise_duration,
    } = req.body

    let query = ``;

    query += 'SELECT * FROM planning_week pk  \n'
    query += 'WHERE pk.planning_week_id > 0  \n'

     if (planning_week_id) {
        query += `AND pk.planning_week_id = ${planning_week_id}  \n`
    }
    if (start_date) {
        query += `AND pk.start_date = ${start_date}  \n`
    }
    if (end_date) {
        query += `AND pk.end_date = ${end_date}  \n`
    };
    if (exercise_count) {
        query += `AND pk.exercise_count = ${exercise_count}  \n`
    };
    if (exercise_duration) {
        query += `AND pk.exercise_duration = ${exercise_duration}  \n`
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

export const createPlanningWeek = async (req: Request, res: Response) => {

    const {
        start_date,
        end_date,
        exercise_count,
        exercise_duration,
    } = req.body

    if (
        !start_date &&
        !end_date &&
        !exercise_count &&
        !exercise_duration
    ) {
        throw new Error("No value input!");
    }

    const escape = (val: any) => val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;

    let query = ``;

    query += `
    INSERT INTO planning_week (
        start_date, end_date, exercise_count, exercise_duration
    ) VALUES (
        '${start_date}',
        '${end_date}',
        ${exercise_count},
        ${exercise_duration}
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