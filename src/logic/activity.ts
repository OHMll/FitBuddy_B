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

        flag_valid,

        form,
    } = req.body

    let query = ``;

    console.log("activity_id", activity_id)

    query += 'SELECT * FROM activity a \n'
    query += 'LEFT JOIN location l ON l.location_id = a.location_id \n'
    query += 'LEFT JOIN sport_type sp ON sp.sport_type_id = a.sport_type_id \n'
    query += 'LEFT JOIN user_sys us ON us.user_sys_id = a.create_by \n'
    query += 'LEFT JOIN conversation c ON c.activity_id = a.activity_id \n'
    query += 'WHERE 1=1 \n'

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

    if (typeof flag_valid === "boolean") {
        query += `AND a.flag_valid = ${flag_valid} \n`
    }

    if (form === 'home') {
        query += `AND a.end_time >= CURRENT_DATE \n`;
    }

    console.log(query)


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });

        console.log("getActivity data", data)
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const updateActivity = async (req: Request, res: Response) => {
    const {
        activity_id, // ต้องมี
        title,
        start_time,
        end_time,
        location_id,
        sport_type_id,
        description,
        style,
    } = req.body;

    if (!activity_id) {
        res.status(400).json({ success: false, message: 'activity_id is required' });
        return
    }

    let updates: string[] = [];

    if (title !== '') updates.push(`title = '${title}'`);
    if (start_time !== '') updates.push(`start_time = '${start_time}'`);
    if (end_time !== '') updates.push(`end_time = '${end_time}'`);
    if (location_id > 0) updates.push(`location_id = ${location_id}`);
    if (sport_type_id > 0) updates.push(`sport_type_id = ${sport_type_id}`);
    if (description !== '') updates.push(`description = '${description}'`)
    if (style !== '') updates.push(`style = '${style}'`)

    if (updates.length === 0) {
        res.status(400).json({ success: false, message: 'No fields provided to update' });
        return
    }

    const query = `
        UPDATE activity
        SET ${updates.join(', ')}
        WHERE activity_id = ${activity_id}
        RETURNING *;
    `;

    console.log("update query:", query);

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, message: 'Activity updated successfully', data });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ success: false, message: 'Error updating activity' });
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
        res.status(404).json({ success: false, message: 'No value input!' });
        return
    }

    if (!title || !create_by || !start_time || !end_time || !style || !location_id || !sport_type_id) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return
    }

    try {
        const escape = (val: any) => val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;

        const finalCreateDate = create_at || new Date().toISOString(); // 'YYYY-MM-DD'


        let query = ``;

        query += `
            INSERT INTO activity (
            create_by, sport_type_id, location_id, description, start_time, end_time, 
            create_at, title, style, flag_valid
        ) VALUES (
            ${create_by},
            ${sport_type_id},
            ${location_id},
            ${description ? `'${description}'` : null},
            '${start_time}',
            '${end_time}',
            '${finalCreateDate}', 
            '${title}',
            '${style}',
            true
        )
        RETURNING *;
        `;

        console.log(query)

        const activityData = await queryPostgresDB(query, globalSmartGISConfig);

        const activityID = activityData[0]['activity_id']

        let conversationQuery = `
            INSERT INTO conversation (activity_id, flag_valid)
            VALUES (${activityID}, true)
            RETURNING *;
        `

        const conversationData = await queryPostgresDB(conversationQuery, globalSmartGISConfig);

        console.log("activityID", activityID)
        console.log("conversationData", conversationData)

        let queryAcPar = ``;

        queryAcPar += `
            INSERT INTO activity_participant (
                activity_id, user_sys_id, joined_at, status
            ) VALUES (
                ${activityID},
                ${create_by},
                '${finalCreateDate}',
                'PENDING'
            )
            RETURNING *;
        `;

        const activityParticipantData = await queryPostgresDB(queryAcPar, globalSmartGISConfig);
        console.log("conversationData", activityParticipantData)

        res.status(200).json({ success: true, activityData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const deleteActivity = async (req: Request, res: Response) => {
    const { activity_id } = req.body;

    if (!activity_id) {
        res.status(400).json({ success: false, message: 'activity_id is required' });
        return
    }



    const queries = [
        `DELETE FROM conversation WHERE activity_id = ${activity_id}`,
        `DELETE FROM activity_participant WHERE activity_id = ${activity_id}`,
        `DELETE FROM activity WHERE activity_id = ${activity_id}`
    ];

    try {
        let data
        for (const query of queries) {
            data = await queryPostgresDB(query, globalSmartGISConfig);
        }

        res.status(200).json({
            success: true,
            message: `ลบกิจกรรมที่มี ID ${activity_id} สำเร็จแล้ว`,
            data
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดขณะลบข้อมูล:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดขณะลบข้อมูล' });
    }
};





export const joinActivity = async (req: Request, res: Response) => {

    const {
        activity_id,
        user_sys_id
    } = req.body

    if (
        !user_sys_id &&
        !activity_id
    ) {
        res.status(400).json({
            success: false,
            errors: [
                { message: "No value input" }
            ]
        });
        return
    }


    const date = new Date();

    // สร้าง string ในรูปแบบ YYYY-MM-DD HH:mm:ss จาก local time (สมมติเครื่องตั้งเวลาไทยไว้แล้ว)
    const pad = (n : any) => n.toString().padStart(2, '0');

    const finalCreateDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    let query = ``;

    query += `
    INSERT INTO activity_participant (
        activity_id, user_sys_id, joined_at, status
    ) VALUES (
        ${activity_id},
        ${user_sys_id},
        '${finalCreateDate}',
        'PENDING'
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

export const startActivity = async (req: Request, res: Response) => {

    try {
        const {
            activity_id,
            user_sys_id
        } = req.body

        if (
            !activity_id
        ) {
            res.status(400).json({
                success: false,
                errors: [
                    { message: "No value input" }
                ]
            });
            return
        }

        const startDate = new Date().toISOString();

        let query = ``;

        query += `
            UPDATE activity_participant 
            SET status = 'DOING' , start_at = '${startDate}', started = true
            WHERE activity_id = ${activity_id}
        `;

        if (user_sys_id) {
            query += `\n AND user_sys_id = ${user_sys_id} \n`
        }

        query += `\n RETURNING *;`

        console.log(query)

        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const stopActivity = async (req: Request, res: Response) => {

    try {
        const {
            activity_id,
            user_sys_id,
            total_calories,
        } = req.body

        if (
            !activity_id &&
            !user_sys_id &&
            !total_calories
        ) {
            res.status(400).json({
                success: false,
                errors: [
                    { message: "No value input" }
                ]
            });
            return
        }

        const finalCreateDate = new Date().toISOString();

        let query = ``;

        query += `
            UPDATE activity_participant 
            SET status = 'DONE', end_at = '${finalCreateDate}', total_calories = ${total_calories}
            WHERE activity_id = ${activity_id} AND user_sys_id = ${user_sys_id}
            RETURNING *;
        `;

        console.log(query)



        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export const deleteActivityParticipant = async (req: Request, res: Response) => {

    const {
        activity_id,
        user_sys_id
    } = req.body;

    if (!user_sys_id && !activity_id) {
        res.status(400).json({
            success: false,
            errors: [
                { message: "No value input" }
            ]
        });
        return;
    }

    let query = ``;

    query += `
    DELETE FROM activity_participant
    WHERE activity_id = ${activity_id} AND user_sys_id = ${user_sys_id}
    RETURNING *;
    `;

    console.log(query);

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ success: false, message: 'Error deleting data' });
    }
};

export const getMyActivity = async (req: Request, res: Response) => {

    const {
        activity_id,
        user_sys_id,
        create_by,
        flag_valid,
        form
    } = req.body

    let query = ``;

    //console.log("activity_id", activity_id)

    query += 'SELECT * FROM activity a \n'
    query += 'LEFT JOIN location l ON l.location_id = a.location_id \n'
    query += 'LEFT JOIN sport_type sp ON sp.sport_type_id = a.sport_type_id \n'
    query += 'LEFT JOIN activity_participant ap ON ap.activity_id = a.activity_id \n'
    if (form === 'call_user') {
        query += 'LEFT JOIN user_sys us ON us.user_sys_id = ap.user_sys_id \n'
    } else {
        query += 'LEFT JOIN user_sys us ON us.user_sys_id = a.create_by \n'
    }
    query += 'WHERE a.activity_id > 0 \n'

    if (activity_id) {
        query += `AND a.activity_id = ${activity_id} \n`
    }
    if (user_sys_id) {
        query += `AND ap.user_sys_id = ${user_sys_id}  \n`
        if (form === 'myex') {
            query += `AND a.create_by != ${user_sys_id} \n`
        }
    }

    if (create_by) {
        query += `AND a.create_by = ${create_by} \n`
    }

    if (typeof flag_valid === 'boolean') {
        query += `AND a.flag_valid = ${flag_valid} \n`
    }

    if (form === 'static') {
        query += `AND ap.end_at IS NOT NULL \n`
    }

    console.log("getMyActivity query", query)


    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);
        res.status(200).json({ success: true, data });

        //console.log(data)
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};



