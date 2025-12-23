import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();

    if (result.rows.length === 0) {
      res.status(200).json({
        success: true,
        message: "No user found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    if (
      String(req.user?.id) !== req.params.id &&
      req.user?.role === "customer"
    ) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await userServices.updateUser(
      req.params.id as string,
      req.body
    );
    if (result.rows.length === 0) {
      res.status(500).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    if ((result.rowCount ?? 0) === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
};
