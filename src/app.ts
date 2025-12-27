import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehicleRouters } from "./modules/vehicle/vehicle.routes";
import { userRouter } from "./modules/user/user.routes";
import { bookingRouters } from "./modules/booking/booking.routes";

const app = express();

// parser
app.use(express.json());
initDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouters);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouters);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, server is working",
  });
});

export default app;
