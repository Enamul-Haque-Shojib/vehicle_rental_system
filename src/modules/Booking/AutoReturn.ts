import { pool } from "../../config/db";
import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    
    const { rows: overdueBookings } = await pool.query(
      `
      SELECT * FROM bookings
      WHERE rent_end_date < $1
      AND booking_status != 'returned'
      `,
      [now]
    );

    for (const booking of overdueBookings) {
    
      await pool.query(
        `
        UPDATE bookings
        SET booking_status = 'returned'
        WHERE id = $1
        `,
        [booking.id]
      );

      
      await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        `,
        [booking.vehicle_id]
      );

      // console.log(`Auto-returned booking ID: ${booking.id}`);
    }
  } catch (err) {
    console.error("Auto-return job failed:", err);
  }
});