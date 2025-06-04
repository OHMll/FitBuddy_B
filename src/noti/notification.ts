// src/task/checkAndNotify.ts
import cron from 'node-cron';
import { sendEmail } from '../noti/mailer';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';

const checkQuery = async () => {
    let query = '';
    query += 'SELECT * FROM activity a \n';
    query += 'LEFT JOIN activity_participant ap ON ap.activity_id = a.activity_id \n';
    query += 'LEFT JOIN user_sys us ON us.user_sys_id = ap.user_sys_id \n';
    query += 'WHERE a.activity_id > 0 \n';

    query += `AND a.start_time BETWEEN NOW() AND NOW() + INTERVAL '16 minutes' \n`;
    query += `AND ap.send_email = false \n`;

    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
}

const updateSendEmail = async (user_sys_id: any, activity_id: any) => {
    let query = '';
    query += `UPDATE activity_participant 
    SET send_email = true
    WHERE user_sys_id = ${user_sys_id} AND
    activity_id = ${activity_id}`;

    console.log(query);
    try {
        const data = await queryPostgresDB(query, globalSmartGISConfig);

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
}

export const scheduleEmailNotification = () => {
    cron.schedule('*/16 * * * *', async () => {
        console.log('⏰ Checking users to notify...');

        try {

            const apdata: any = await checkQuery();

            for (const user of apdata) {
                const userData = await sendEmail(user.email);
                const updateAP = await updateSendEmail(parseInt(user.user_sys_id), parseInt(user.activity_id));
            }

            console.log(`✅ Notifications sent to users: ${apdata}`);
        } catch (error) {
            console.error('❌ Error sending notifications:', error);
        }
    });
};
