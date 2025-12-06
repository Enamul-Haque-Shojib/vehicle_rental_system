import { Request, Response } from "express";
import { UserServices } from "./User.service";

const getAllUsers = async (req: Request, res: Response) => {

  try {
    const result = await UserServices.getAllUsersFromDB();
    if(result.rows.length ===0){
      res.status(200).json({
      success: true,
      message: "No users found",
      data: [],
      
    });
    }else{
      res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
      
    });
    }
  
    
  } catch (err: any) {
    
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const updateUser = async (req: Request, res: Response) => {

    const user = req.user;
  
  try {
    const result = await UserServices.updateUserIntoDB(req.body, req.params.userId!, user);

    if (result.rows.length === 0) {
      res.status(404).json({
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
    const result = await UserServices.deleteUserFromDB(req.params.userId!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const UserControllers = {
    getAllUsers,
    updateUser,
    deleteUser,

}