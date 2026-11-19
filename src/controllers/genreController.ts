import type { Request, Response } from "express";
import { genreSchema } from "../utils/zodSchema";
import Genre from "../models/Genre";


export const getGenres = async (req: Request, res: Response) => {
    try {
        const genres = await Genre.find();

        return res.json({
            data: genres,
            message: "Genres fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching genres:", error);
        return res.json({
            data: null,
            message: "Error fetching genres",
            status: 500
        });
    };
};

export const getGenreDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findById(id);

        return res.json({
            data: genre,
            message: "Genre detail fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error(error);
        return res.json({
            data: null,
            message: "Error fetching genre detail",
            status: 500
        });
    };
};

export const postGenre = async (req: Request, res: Response) => {
    try {
        const body = genreSchema.parse(req.body);

        const genre = new Genre({
            name: body.name
        })

        const newData = await genre.save();

        return res.json({
            data: newData,
            message: "Genre created successfully",
            status: 201
        })

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error creating genre",
            status: 500
        });
    }
}

export const putGenre = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const body = genreSchema.parse(req.body);

        await Genre.findByIdAndUpdate(id, {
            name: body.name 
        });

        const updatedData = await Genre.findById(id);

        return res.json({
            data: updatedData,
            message: "Genre updated successfully",
            status: 200
        })

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error updating genre",
            status: 500
        });
    }
}

export const deleteGenre = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedData = await Genre.findByIdAndDelete(id);

        await Genre.findByIdAndDelete(id);

        return res.json({
            data: deletedData,
            message: "Genre deleted successfully",
            status: 200
        })

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error deleting genre",
            status: 500
        });
    }
}