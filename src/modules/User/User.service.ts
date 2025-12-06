import { pool } from "../../config/db";
import updateTable from "../../helpers/updateTable";
import bcrypt from "bcryptjs";

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};


const updateUserIntoDB = async (payload: Record<string, unknown>, id: string, user: any) => {

const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    id,
  ]);

  if (userResult.rows.length === 0) {
    throw new Error("User not found!");
  }

 const userData = userResult.rows[0];



 if (user.role === "customer"){
  
     if ("role" in payload) {
        throw new Error("Customers cannot change their role!");
    }

    if("password" in payload){
      const hashedPass = await bcrypt.hash(payload.password as string, 10);
      payload.password = hashedPass;
    } 

    
    if(userData.id == user.id){
         const updateUser = await updateTable(payload, id, 'users');
       
         delete updateUser.rows[0].password;
        return updateUser
    }else{
        throw new Error("User not found!");
    }
 }

  if ("password" in payload) {
        throw new Error("Admin cannot change users password!");
    }

 const updateUser = await updateTable(payload, id, 'users');
 delete updateUser.rows[0].password;
  return updateUser
};

const deleteUserFromDB = async (id: string) => {

  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [
    id,
  ]);

  if(bookingResult.rows.length > 0){
    if(bookingResult.rows[0].status==="active"){
      throw new Error("Cannot delete user with active bookings!");
    }
  }
  

  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
    id,
  ]);
  return result;
};




export const UserServices = {
    getAllUsersFromDB,
    updateUserIntoDB,
    deleteUserFromDB
}