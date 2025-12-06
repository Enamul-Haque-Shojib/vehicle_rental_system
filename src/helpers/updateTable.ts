import { pool } from "../config/db";


const updateTable = async (payload: Record<string, unknown>, id: string, table: string) =>{
  
      const fields = Object.keys(payload);
      
      if (fields.length === 0) {
        throw new Error("No fields provided for update");
      }
      const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");
   
      const values = Object.values(payload);
      values.push(id);
    
      const result = await pool.query(
        `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`,
        values
      );

      return result;
}

export default updateTable;