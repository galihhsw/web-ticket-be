import express from "express";
import { getMovies, getGenre, getMovieDetail, getAvailableSeats, getMovieFilter } from "../../controllers/globalController";
import { validateRequest } from "../../middlewares/validateRequest";
import { transactionSchema } from "../../utils/zodSchema";
import { getOrderDetail, getOrders, transactionTicket } from "../../controllers/ticketController";

const globalRoutes = express.Router()

globalRoutes.get("/movies", getMovies)
globalRoutes.get("/genres", getGenre)
globalRoutes.get("/movies/:id", getMovieDetail)
globalRoutes.get("/check-seats/movieId", getAvailableSeats)
globalRoutes.get("/browse-movies/:genreId", getMovieFilter)

globalRoutes.post("/transaction/buy", validateRequest(transactionSchema), transactionTicket)
globalRoutes.get("/orders", getOrders)
globalRoutes.get("/orders/:id", getOrderDetail)

export default globalRoutes;