import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
};

const updateUser = async (id: string, payload: Record<string, any>) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const keys = Object.keys(payload);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(payload);

  values.push(id);
  const query = `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING id, name, email, phone, role`;

  const result = await pool.query(query, values);
  return result;
};

const deleteUser = async (id: string) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE user_id = $1 AND status = 'active' LIMIT 1`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user: active bookings exist.");
  }

  return await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

export const userServices = {
  getUsers,
  updateUser,
  deleteUser,
};
