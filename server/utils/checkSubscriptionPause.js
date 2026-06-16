import cron from 'node-cron';
import { pool } from '../models/db.js';

export const expireOldPauses = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await pool.query(`
        UPDATE subscription_pause 
        SET status = 'expired'
        WHERE to_date < CURRENT_DATE 
        AND status = 'active'
      `);
      console.log(`Expired ${result.rowCount} pauses`);
    } catch (error) {
      console.error('Error expiring pauses:', error.message);
    }
  });
};