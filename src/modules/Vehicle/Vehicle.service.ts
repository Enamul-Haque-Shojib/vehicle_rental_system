
import { pool } from "../../config/db";
import updateTable from "../../helpers/updateTable";


const createVehicleIntoDB = async (payload: Record<string, unknown>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;


  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result;
};

const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getSingleVehicleFromDB = async (id: string) => {

  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
  return result;
};


const updateVehicleIntoDB = async (payload: Record<string, unknown>, id: string) => {
  return updateTable(payload, id, 'vehicles');
};

const deleteVehicleFromDB = async (id: string) => {
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1`, [
    id,
  ]);

  if(bookingResult.rows.length > 0){
    if(bookingResult.rows[0].status==="active"){
      throw new Error("Cannot delete vehicle with active bookings!");
    }
  }

  const result = await pool.query("DELETE FROM vehicles WHERE id=$1 RETURNING *", [
    id,
  ]);
  return result;
};


export const VehicleServices = {
    createVehicleIntoDB,
    getAllVehiclesFromDB,
    getSingleVehicleFromDB,
    updateVehicleIntoDB,
    deleteVehicleFromDB
}