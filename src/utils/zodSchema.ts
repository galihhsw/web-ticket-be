import z from "zod";

export const genreSchema = z.object({
    name: z.string().min(5, "Genre name is required"),
}).strict();

export const theaterSchema = z.object({
    name: z.string().min(5, "Theater name is required"),
    city: z.string().min(1, "Theater city is required"),
}).strict();