import type { Request, Response, NextFunction } from "express";
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';
import { error } from 'console';

export const getPlanningDay = async (req: Request, res: Response) => {

    const {
        planning_day_id,
        current_date,
        start_time,
        duration,
        title,
        status,
        planning_create_by,
        sport_type_id,
    } = req.body

    let query = ``;

    query += 'SELECT * FROM planning_day pd \n'
    query += 'LEFT JOIN sport_type sp ON sp.sport_type_id = pd.sport_type_id \n'
    query += 'WHERE 1 = 1 \n'

    if (planning_day_id) {
        query += `AND pd.planning_day_id = ${planning_day_id}  \n`
    }
    if (current_date) {
        query += `AND pd.currentdate = ${current_date}  \n`
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
    if (sport_type_id) {
        query += `AND pd.sport_type_id = ${sport_type_id}  \n`
    };

    // console.log(query)

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });

        // console.log(data)
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const createPlanningDay = async (req: Request, res: Response) => {

    const {
        current_date,
        start_time,
        duration,
        title,
        status,
        planning_create_by,
        sport_type_id,
    } = req.body

    if (
        !current_date &&
        !start_time &&
        !duration &&
        !title &&
        !status &&
        !planning_create_by &&
        !sport_type_id
    ) {
        throw new Error("No value input!");
    }

    const escape = (val: any) => val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;


    let query = ``;

    query += `
    INSERT INTO planning_day (
        "current_date", start_time, duration, title, status, planning_create_by, sport_type_id
    ) VALUES (
        '${current_date}',
        '${start_time}',
        ${duration},
        '${title}',
        '${status}',
        ${planning_create_by},
        ${sport_type_id}
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

export const deletePlanningDay = async (req: Request, res: Response, next: NextFunction) => {
    const { planning_day_id } = req.body;

    if (!planning_day_id) {
        res.status(400).json({ success: false, message: "Missing 'id' to delete." });
        return
    }

    const query = `
        DELETE FROM planning_day
        WHERE planning_day_id = ${planning_day_id}
        RETURNING *;
    `;

    console.log(query);

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        if (data.length === 0) {
            res.status(404).json({ success: false, message: "No record found to delete." });
            return
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ success: false, message: "Error deleting data" });
    }
};

// ใน controller ของคุณ
export const updateWorkoutStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { planning_day_id, status } = req.body;

    if (!planning_day_id || !status) {
        res.status(400).json({ success: false, message: "Missing 'planning_day_id' or 'status'." });
        return 
    }

    const query = `
        UPDATE planning_day
        SET status = '${status}'
        WHERE planning_day_id = ${planning_day_id}
        RETURNING *;
    `;

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        if (data.length === 0) {
            res.status(404).json({ success: false, message: "Workout not found." });
            return 
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error updating workout status:", error);
        res.status(500).json({ success: false, message: "Error updating workout status" });
    }
};
