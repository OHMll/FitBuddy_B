import { Request, Response } from 'express';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';
import { error } from 'console';

export const getPlanningWeek = async (req: Request, res: Response) => {

    const {
        planning_week_id,
        start_date,
        end_date,
        exercise_count,
        exercise_duration,
        currentWorkouts,
        currentMinutes,
        user_sys_id,
    } = req.body

    let query = ``;

    query += 'SELECT * FROM planning_week pk  \n'
    query += 'WHERE 1 = 1  \n'

    if (planning_week_id) {
        query += `AND pk.planning_week_id = ${planning_week_id}  \n`
    }
    if (start_date) {
        query += `AND pk.start_date = '${start_date}'  \n`
    }
    if (end_date) {
        query += `AND pk.end_date = '${end_date}'  \n`
    };
    if (exercise_count) {
        query += `AND pk.exercise_count = ${exercise_count}  \n`
    };
    if (exercise_duration) {
        query += `AND pk.exercise_duration = ${exercise_duration}  \n`
    };
    if (currentWorkouts) {
        query += `AND pk.current_workouts = ${currentWorkouts}  \n`
    };
    if (currentMinutes) {
        query += `AND pk.current_minutes = ${currentMinutes}  \n`
    };
    if (user_sys_id) {
        query += `AND pk.user_sys_id = ${user_sys_id}  \n`
    };

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });

        console.log("getPlanningWeek", query);
        // console.log(data)
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
        currentWorkouts,
        currentMinutes,
        user_sys_id,
    } = req.body

    if (
        !start_date &&
        !end_date &&
        !exercise_count &&
        !exercise_duration &&
        !currentWorkouts &&
        !currentMinutes &&
        !user_sys_id
    ) {
        throw new Error("No value input!");
    }

    const escape = (val: any) => val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;

    let query = ``;

    query += `
    INSERT INTO planning_week (
    start_date, end_date, exercise_count, exercise_duration, current_workouts, current_minutes, user_sys_id
    ) VALUES (
    '${start_date}',
    '${end_date}',
    ${exercise_count},
    ${exercise_duration},
    ${currentWorkouts},
    ${currentMinutes},
    ${user_sys_id}
    )
    RETURNING *;
    `;

    console.log("createPlanningWeek",query);


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const updateCurrentProgress = async (req: Request, res: Response) => {
    const { planning_week_id, currentWorkouts, currentMinutes, user_sys_id } = req.body

    if (!planning_week_id) {
        res.status(400).json({ success: false, message: "Missing planning_week_id" })
        return
    }
    
    const query = `
    UPDATE planning_week
    SET current_workouts = ${currentWorkouts}, current_minutes = ${currentMinutes}
    WHERE planning_week_id = '${planning_week_id}' AND
    user_sys_id = ${user_sys_id}
    RETURNING *;
  `
    console.log("updateCurrentProgress", query)
    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig)
        res.status(200).json({ success: true, data })
        console.log("UpdateData: ", data);
    } catch (error) {
        console.error('Error updating current progress:', error)
        res.status(500).json({ success: false, message: 'Error updating data' })
    }
}
