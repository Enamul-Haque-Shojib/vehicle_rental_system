import { Request, Response } from "express";
import { AuthServices } from "./Auth.service";



const createUser = async (req: Request, res: Response) => {

  try {
    const result = await AuthServices.createUserIntoDB(req.body);
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
      
    });
  } catch (err: any) {
  
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await AuthServices.loginUserIntoDB(email, password);
  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const AuthControllers = {
    createUser,
    loginUser
}