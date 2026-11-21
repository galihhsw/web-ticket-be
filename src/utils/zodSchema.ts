import z from "zod";

export const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

export const genreSchema = z.object({
    name: z.string().min(5, "Genre name is required"),
}).strict();

export const theaterSchema = z.object({
    name: z.string().min(5, "Theater name is required"),
    city: z.string().min(1, "Theater city is required"),
}).strict();

export const movieSchema = z.object({
    title: z.string().min(1, "Movie title is required"),
    genre: z.string().min(1, "Movie genre is required"),
    theaters: z.array(z.string().min(1, "Movie theater is required")).min(1, "At least one theater is required"),
    available: z.boolean().default(false),
    description: z.string().min(5, "Movie description is required"),
    price: z.number().min(0, "Movie price is required"),
    bonus: z.string().optional(),
}).strict();