import { Request, Response } from "express";
import { BookingServices } from "./Booking.service";


const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingServices.createBookingIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
      
      
    });
  } catch (err: any) {
  
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;


    const data = await BookingServices.getAllBookingsFromDB(user);

    if (user?.role === "admin") {
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user;

    const response = await BookingServices.updateBookingIntoDB(Number(bookingId), status, user);

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const BookingControllers = {
    createBooking,
    getAllBookings,
    updateBooking
}