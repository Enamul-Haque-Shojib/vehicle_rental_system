import { pool } from "../../config/db";

const createBookingIntoDB = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;


  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

    

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }
  
  const dailyPrice = Number(vehicle.daily_rent_price);

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diffTime = end.getTime() - start.getTime();
  const days = diffTime / (1000 * 60 * 60 * 24);

  if (days <= 0) {
    throw new Error("rent_end_date must be after rent_start_date");
  }


  const total_price = dailyPrice * days;

  
  const result = await pool.query(
    `
      INSERT INTO bookings(
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  const updateVehicle = await pool.query(
      `UPDATE vehicles SET availability_status = 'booked', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [vehicle_id]
    );

  const booking = result.rows[0];
  

  return {
    ...booking,
     vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price)
    }
  };
};


const getAllBookingsFromDB = async (user: any) => {
  if (user.role === "admin") {
    
    const result = await pool.query(`
      SELECT 
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `);

    
    return result.rows.map(row => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      }
    }));
  }

  
  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.created_at DESC
    `,
    [user.id]
  );

  
  return result.rows.map(row => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    }
  }));
};





const updateBookingIntoDB = async (bookingId: number, status: string, user: any) => {
  
  const bookingData = await pool.query(
    `
    SELECT 
      b.*, 
      v.availability_status, 
      v.id AS vehicle_id
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1
    `,
    [bookingId]
  );

  if (bookingData.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingData.rows[0];

  

  
  if (user.role === "customer") {
    if (booking.customer_id !== user.id) throw new Error("Unauthorized");

    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    if (booking.status !== "active") {
      throw new Error("Only active bookings can be cancelled");
    }

    
    const updated = await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [bookingId]
    );
    const updateVehicle = await pool.query(
      `UPDATE vehicles SET availability_status = 'available', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking cancelled successfully",
      data: updated.rows[0],
    };
  }

  
  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admins can only mark bookings as returned");
    }

    
    const updatedBooking = await pool.query(
      `
      UPDATE bookings 
      SET status = 'returned', updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [bookingId]
    );

    
    const updatedVehicle = await pool.query(
      `
      UPDATE vehicles 
      SET availability_status = 'available'
      WHERE id = $1
      RETURNING availability_status
      `,
      [booking.vehicle_id]
    );

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updatedBooking.rows[0],
        vehicle: updatedVehicle.rows[0],
      },
    };
  }

  throw new Error("Invalid role");
};



export const BookingServices = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    updateBookingIntoDB
}