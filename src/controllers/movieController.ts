import { Request, Response } from "express";
import Movie from "../models/Movie";
import { movieSchema } from "../utils/zodSchema";
import path from "node:path";
import fs from "node:fs";
import Genre from "../models/Genre";
import Theater from "../models/Theater";

export const getMovies = async (req: Request, res: Response) => {

    try {
        const movies = await Movie.find().populate({
            path : "genre",
            select: "name"
        }).populate({
            path: "theaters",
            select: "name"
        }); 

        return res.json({
            data: movies,
            message: "Movies fetched successfully",
            status: 200
        });

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error fetching movies",
            status: 500
        });
    }
}

export const getMovieDetails = async (req: Request, res: Response) => {

    try {
        const {id} = req.params


        const movie = await Movie.findById(id).populate({
            path : "genre",
            select: "name"
        }).populate({
            path: "theaters",
            select: "name"
        }); 

        return res.json({
            data: movie,
            message: "Movie Details fetched successfully",
            status: 200
        });

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error fetching movie details",
            status: 500
        });
    }
}

export const createMovie = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.json({
                data: null,
                message: "Thumbnail is required",
                status: 400
            });
        }

        const parse = movieSchema.safeParse({
            title: req.body.title,
            genre: req.body.genre,
            theaters: req.body.theaters.split(","),
            available: req.body.available === "1" ? true : false,
            description: req.body.description,
            price: Number.parseInt(req.body.price),
            bonus: req.body?.bonus
        })

        if (!parse.success) {
            const errors = parse.error.issues.map(issue => issue.message);

            return res.json({
                data: null,
                message: "invalid data provided",
                details: errors,
                status: 400
            });

        }

        const movie = new Movie({

            title: parse.data.title,
            genre: parse.data.genre,
            theaters: parse.data.theaters,
            available: parse.data.available,
            thumbnail: req.file?.filename,
            description: parse.data.description,
            price: parse.data.price,
            bonus: parse.data.bonus,

        });

        await movie.save();

        return res.json({
            data: movie,
            message: "Movie created successfully",
            status: 201
        });

    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error creating movie",
            status: 500
        });
    }
}

export const updateMovie = async (req: Request, res: Response) => {
    try {

        const {id} = req.params;

        const parse = movieSchema.safeParse({
            title: req.body.title,
            genre: req.body.genre,
            theaters: req.body.theaters.split(","),
            available: req.body.available === "1" ? true : false,
            description: req.body.description,
            price: Number.parseInt(req.body.price),
            bonus: req.body?.bonus
        })

        if (!parse.success) {
            const errors = parse.error.issues.map(issue => issue.message);

            return res.json({
                data: null,
                message: "invalid data provided",
                details: errors,
                status: 400
            });

        }
        

        const oldMovie = await Movie.findById(id);

        if (!oldMovie) {
            return res.json({
                data: null,
                message: "Movie not found",
                status: 404
            });
        }

        if (req.file) {
            const dirname = path.resolve()
            const filepath = path.join(
                dirname,
                "public/uploads/thumbnails",
                oldMovie.thumbnail ?? ""
            )

            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath)
            }
        }

        await Genre.findByIdAndUpdate(oldMovie.genre, {
                    $pull : { movies: oldMovie._id }
                }) 
        
        for  (const theater of oldMovie.theaters) {
                    await Theater.findByIdAndUpdate(theater._id, {
                        $pull: {
                            movies: theater._id
                        }
                    })
        }

        await Movie.findByIdAndUpdate(oldMovie._id, {
            title: parse.data.title,
            genre: parse.data.genre,
            theaters: parse.data.theaters,
            available: parse.data.available,

            thumbnail: req.file ? req.file.filename : oldMovie.thumbnail,

            description: parse.data.description,
            price: parse.data.price,
            bonus: parse.data.bonus,
        })

        await Genre.findByIdAndUpdate(parse.data.genre, {
                    $push : { movies: id }
                }) 
        
        for  (const theater of parse.data.theaters) {
                    await Theater.findByIdAndUpdate(theater, {
                        $push: {
                            movies: id
                        }
                    })
        }

        const updatedMovie = await Movie.findById(id)

        return res.json({
            data: updatedMovie,
            message: "Movie updated successfully",
            status: 201
        });



    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error updating movie",
            status: 500
        });
    }
}

export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id)

        if(!movie) {
            return res.status(400).json({
                data: null,
                message: "Movie not found",
                status: 400
            })
        }

        const dirname = path.resolve()
        const filepath = path.join(
            dirname,
            "public/uploads/thumbnails",
            movie.thumbnail ?? ""
        )
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }

        await Genre.findByIdAndUpdate(movie.genre, {
                    $pull : { movies: movie._id }
                }) 
        
                for  (const theater of movie.theaters) {
                    await Theater.findByIdAndUpdate(theater._id, {
                        $pull: {
                            movies: theater._id
                        }
                    })
                }

        await Movie.findByIdAndDelete(id)

        return res.json({
            data: movie ,
            message: "Movie deleted successfully",
            status: 200
        });



    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            message: "Error deleting movie",
            status: 500
        });
    }
}