import type { Request, Response } from "express"
import Movie from "../models/Movie";
import Genre from "../models/Genre";
import Transaction from "../models/Transaction";
import Theater from "../models/Theater";

export const getMovies = async (req: Request, res: Response) => {
    try {
            const data = await Movie.find().select("title thumbnail").populate({
                path: "genre",
                select: "name -_id"
            }).limit(4)

            return res.json({
            data: data,
            message: "Data fetched successfully",
            status: 200
        })
    
        } catch (error) {  
            console.error("Error fetching data:", error);
            return res.json({
                data: null,
                message: "Error fetching data",
                status: 500
            });
        };
}

export const getMovieDetail = async (req: Request, res: Response) => {
    try {
        
        const {id} = req.params

        const rows = ["A", "B", "C", "D", "E"];
        const seats = [];

        for (const row of rows) {
            for (let i = 0; i < 5; i++) {
                seats.push({
                    seat: `${row}${i + 1}`,
                    isBooked: false,
                });
            }
        }

        const movie = await Movie.findById(id)
        .populate({
            path:"theaters",
            select: "name city"
        })
        .populate({
            path:"genre",
            select: "name -_id"
        })

        return res.json({
        data: {
            movie: {
                ...movie?.toJSON(),
                seats,
                times: ["10:30", "12:30", "14:40", "17:00", "19:30", "21:00"]

            }
        },
        message: "Data fetched successfully",
        status: 200
        })
    
        } catch (error) {  
            console.error("Error fetching data:", error);
            return res.json({
                data: null,
                message: "Error fetching data",
                status: 500
            });
        };
}

export const getGenre = async (req: Request, res: Response) => {
    try {
        const genres = await Genre.find().select("name").limit(4);

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

export const getAvailableSeats = async (req: Request, res: Response) => {
    try {
        const {movieId} = req.params
        const {date} = req.query

        const transactions = await Transaction.find({
            date: date?.toString().replace("+", " "),
            movie: movieId
        }).select("seats").populate({
            path: "seats",
            select: "seat"
        })

        const seats = []
        
        for(const seat of transactions) {
            seats.push(...seat.seats)
        }

        return res.json({
            data: seats,
            message: "Seats data fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching seats data:", error);
        return res.json({
            data: null,
            message: "Error fetching seats data",
            status: 500
        });
    };
}

export const getMovieFilter = async (req: Request, res: Response) => {
    try {
        const {genreId} = req.params
        const {city, theaters, availability} = req.query

        let filterQuery: any = {}

        if (genreId) {
            filterQuery = {
                ...filterQuery,
                genre : genreId
            }
        }

        if (city) {
            const theaterList = await Theater.find({
                city: city
            })

            const theaterIds = theaterList.map((the) => the.id)
            
            filterQuery = {
                ...filterQuery,
                theaters: {
                    $in: [...theaterIds]
                }
            }
        }

        if (theaters) {
            const theaterIds2 = theaters as string []

            filterQuery = {
                ...filterQuery,
                theaters: {
                    $in: [...(filterQuery?.theaters.$in ?? []), theaterIds2]
                }
            }
        } 

        if (availability === "true") {
            filterQuery = {
                ...filterQuery,
                available: true
            }
        }

        const data = await Movie.find({
            ...filterQuery
        }).select("title genre thumbnail").populate({
            path: "genre",
            select: "name"
        })

        const allData = await Movie.find().select("title genre theaters thumbnail").populate({
            path: "genre",
            select: "name"
        }).populate({
            path: "theaters",
            select: "city"
        })


        return res.json({
            data: {
                filteredMovies: data,
                allMovies: allData
            },
            message: "Data fetched successfully",
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
}




