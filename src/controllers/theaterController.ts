import type { Request, Response } from "express";
import Theater from "../models/Theater";
import { theaterSchema } from "../utils/zodSchema";

export const getTheaters = async (req: Request, res: Response) => {
    try {
        const theaters = await Theater.find();

        return res.json({
            data: theaters,
            message: "Theaters fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching theaters:", error);
        return res.json({
            data: null,
            message: "Error fetching theaters",
            status: 500
        });
    };
};

export const getTheaterDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const theater = await Theater.findById(id);

        return res.json({
            data: theater,
            message: "Theater detail fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error(error);
        return res.json({
            data: null,
            message: "Error fetching theater detail",
            status: 500
        });
    };
};

export const postTheater = async (req: Request, res: Response) => {
    try {
        const body = theaterSchema.parse(req.body);

        const theater = new Theater({
            name: body.name,
            city: body.city
        })

        const newData = await theater.save();

        return res.json({
            data: newData,
            message: "Theater created successfully",
            status: 201
        })

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error creating theater",
            status: 500
        });
    }
}

export const putTheater = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const body = theaterSchema.parse(req.body);

        await Theater.findByIdAndUpdate(id, {
            name: body.name,
            city: body.city
        });

        const updatedData = await Theater.findById(id);

        return res.json({
            data: updatedData,
            message: "Theater updated successfully",
            status: 200
        })

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error updating theater",
            status: 500
        });
    }
}

export const deleteTheater = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedData = await Theater.findByIdAndDelete(id);

        await Theater.findByIdAndDelete(id);

        return res.json({
            data: deletedData,
            message: "Theater deleted successfully",
            status: 200
        })

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error deleting theater",
            status: 500
        });
    }
}