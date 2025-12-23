import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create booking",
      errors: err.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings(req.user);

    res.status(200).json({
      success: true,
      message:
        req.user?.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      errors: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId as string;
    const result = await bookingServices.updateBooking(
      bookingId,
      req.user,
      req.body
    );

    const isReturned = req.body.status === "returned";

    res.status(200).json({
      success: true,
      message: isReturned
        ? "Booking marked as returned. Vehicle is now available"
        : "Booking cancelled successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update booking",
      errors: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
