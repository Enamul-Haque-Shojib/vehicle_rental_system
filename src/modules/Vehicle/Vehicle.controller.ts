import { Request, Response } from "express";
import { VehicleServices } from "./Vehicle.service";

const createVehicle = async (req: Request, res: Response) => {

  try {
    const result = await VehicleServices.createVehicleIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle Created Successfully",
      data: result.rows[0],
      
    });
  } catch (err: any) {
    
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getAllVehicles = async (req: Request, res: Response) => {

  try {
    const result = await VehicleServices.getAllVehiclesFromDB();
    if(result.rows.length ===0){
      res.status(200).json({
      success: true,
      message: "No vehicles found",
      data: [],
      
    });
    }else{
      res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
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

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await VehicleServices.getSingleVehicleFromDB(req.params.vehicleId!);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
      
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  
  try {
    const result = await VehicleServices.updateVehicleIntoDB(req.body, req.params.vehicleId!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
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

const deleteVehicle = async (req: Request, res: Response) => {
  
  try {
    const result = await VehicleServices.deleteVehicleFromDB(req.params.vehicleId!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const VehicleControllers = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}