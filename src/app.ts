import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehicleRouters } from "./modules/vehicle/vehicle.routes";

const app = express();
initDB();

// parser
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouters);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, server is working",
  });
});

export default app;
