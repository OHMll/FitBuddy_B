import cron from 'node-cron';
import { queryPostgresDB, globalSmartGISConfig } from '../config/db';


const checkAndUpdateParticipants = async () => {
    try {
        const selectQuery = `
            SELECT ap.activity_id, ap.user_sys_id, a.end_time
            FROM activity_participant ap
            LEFT JOIN activity a ON ap.activity_id = a.activity_id
            WHERE ap.started = true
              AND a.end_time < NOW()
              AND ap.status = 'PENDING'
        `;

        const selectQueryData = await queryPostgresDB(selectQuery, globalSmartGISConfig);

        if (selectQueryData.length > 0) {
            for (const row of selectQueryData) {
                const endAt = new Date(row.end_time);
                const formattedEndAt = endAt.toISOString().replace('T', ' ').substring(0, 19); // 'YYYY-MM-DD HH:mm:ss'

                const updateQuery = `
                    UPDATE activity_participant
                    SET status = 'DONE',
                        end_at = '${formattedEndAt}',
                        total_calories = 0
                    WHERE activity_id = ${row.activity_id} AND user_sys_id = ${row.user_sys_id}
                `;
                await queryPostgresDB(updateQuery, globalSmartGISConfig);
            }

            console.log(`✅ Updated ${selectQueryData.length} participants to DONE`);
        } else {
            console.log(`ℹ️ No participants to update`);
        }
    } catch (err) {
        console.error('❌ Error in checkAndUpdateParticipants:', err);
    }
};


export const scheduleCheckActivityData = () => {
    cron.schedule('*/10 * * * *', async () => {
        console.log('⏰ Checking activity to not clear...');

        try {

            await checkAndUpdateParticipants()

            console.log(`✅ Checking activity done!`);
        } catch (error) {
            console.error('❌ Error Checking activity:', error);
        }
    });
};

