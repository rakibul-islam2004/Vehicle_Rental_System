import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), bookingController.createBooking);

router.get("/", auth("admin", "customer"), bookingController.getAllBookings);

router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);

export const bookingRouters = router;
