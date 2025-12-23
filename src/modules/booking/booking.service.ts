import { pool } from "../../config/db";

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicleResult = await client.query(
      "SELECT * FROM vehicles WHERE id = $1 FOR UPDATE",
      [vehicle_id]
    );
    const vehicle = vehicleResult.rows[0];

    if (!vehicle) throw new Error("Vehicle not found");
    if (vehicle.availability_status !== "available")
      throw new Error("Vehicle is already booked");

    const days =
      (new Date(rent_end_date).getTime() -
        new Date(rent_start_date).getTime()) /
      (1000 * 3600 * 24);
    const total_price = days * parseFloat(vehicle.daily_rent_price);

    await client.query(
      "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
      [vehicle_id]
    );

    const bookingResult = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    await client.query("COMMIT");

    return {
      ...bookingResult.rows[0],
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllBookings = async (user: any) => {
  const result = await pool.query(`
    SELECT bookings.*, vehicles.vehicle_name, vehicles.registration_number, vehicles.type, users.name, users.email
    FROM bookings
    JOIN vehicles ON bookings.vehicle_id = vehicles.id
    JOIN users ON bookings.customer_id = users.id
  `);

  const rows = result.rows;

  if (user.role === "admin") {
    return rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      customer: { name: row.name, email: row.email },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  }

  return rows
    .filter((row) => row.customer_id === user.id)
    .map((row) => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type,
      },
    }));
};

const updateBooking = async (bookingId: string, user: any, payload: any) => {
  const { status } = payload;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingData = await client.query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId]
    );
    const booking = bookingData.rows[0];

    if (!booking) throw new Error("Booking not found");
    if (user.role === "customer" && booking.customer_id !== user.id)
      throw new Error("Unauthorized");

    const result = await client.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, bookingId]
    );

    if (status === "returned" || status === "cancelled") {
      await client.query(
        "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
        [booking.vehicle_id]
      );
    }

    await client.query("COMMIT");

    if (status === "returned") {
      return {
        ...result.rows[0],
        vehicle: { availability_status: "available" },
      };
    }

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const bookingServices = { createBooking, getAllBookings, updateBooking };
