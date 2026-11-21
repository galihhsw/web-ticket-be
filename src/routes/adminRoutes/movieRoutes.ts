import express from "express";
import multer from "multer";
import { getMovies, createMovie, updateMovie, deleteMovie, getMovieDetails } from "../../controllers/movieController";
import { thumbnailStorage, imageFilter } from "../../utils/multer";

const upload = multer({
    storage: thumbnailStorage(),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}); 

const movieRoutes = express.Router();

movieRoutes.get("/movies", getMovies);
movieRoutes.get ("/movies/:id", getMovieDetails);
movieRoutes.post("/movies", upload.single("thumbnail"), createMovie);
movieRoutes.put("/movies/:id", upload.single("thumbnail"), updateMovie);
movieRoutes.delete ("/movies/:id", deleteMovie);

export default movieRoutes;