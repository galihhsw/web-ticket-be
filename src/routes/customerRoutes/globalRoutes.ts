import express from "express";
import { getMovies, getGenre, getMovieDetail, getAvailableSeats, getMovieFilter } from "../../controllers/globalController";

const globalRoutes = express.Router()

globalRoutes.get("/movies", getMovies)
globalRoutes.get("/genres", getGenre)
globalRoutes.get("/movies/:id", getMovieDetail)
globalRoutes.get("/check-seats/movieId", getAvailableSeats)
globalRoutes.get("/browse-movies/:genreId", getMovieFilter)

export default globalRoutes;