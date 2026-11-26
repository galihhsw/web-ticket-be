import { CustomRequest } from "../types/Request";
import { transactionSchema } from "../utils/zodSchema";
import type { Request, Response } from "express";
import Transaction from "../models/Transaction";
import TransactionSeat from "../models/TransactionSeat";
import Wallet from "../models/Wallet";


export const transactionTicket = async (req: CustomRequest, res: Response) => {
    try {
        const parse = transactionSchema.parse(req.body)

        const wallet = await Wallet.findOne({
            user: req.user?.id
        })

        if (!wallet || (wallet && wallet.balance < parse.total)) {
            return res.status(400).json({
                status: "failed",
                message: "Insufficient balance, please top up your balance first",
                data: null
            })
        }

        const transaction = new Transaction({
            bookingFee : parse.bookingFee,
            total : parse.total,
            subtotal : parse.subtotal,
            tax : parse.tax,
            movie : parse.movieId,
            theater: parse.theaterId,
            user: req.user?.id,
            date: parse.date
        })

        for (const seat of parse.seats) {
            const newSeat = new TransactionSeat({
                transaction: transaction.id,
                seat: seat
            })

            await newSeat.save()
        }

        const transactionSeats = await TransactionSeat.find({
            transaction : transaction.id
        })

        transaction.seats = transactionSeats.map((va) => va._id)

        const currentBalance = wallet.balance ?? 0 
        await Wallet.findByIdAndUpdate(wallet.id, {
            balance: currentBalance - parse.total
        })

        await transaction.save()

        return res.json({
            message: "Transaction ticket successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error Transaction ticket:", error);
        return res.json({
            data: null,
            message: "Error Transaction ticket",
            status: 500
        });
    };
};

export const getOrders = async (req: CustomRequest, res: Response) => {
    try {
        const transactions = await Transaction.find({
            user: req.user?.id
        }).select("seats movie theater date status").populate({
            path: "movie",
            select: "thumbnail title genre -_id",
            populate: {
                path: "genre",
                select: "name -_id"
            }
        }).populate({
            path: "seats",
            select: "seat -_id"
        }).populate({
            path: "theater",
            select: "name city -_id"
        })


        return res.json({
            data: transactions,
            message: "Transactions fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching Data:", error);
        return res.json({
            data: null,
            message: "Error fetching Data",
            status: 500
        });
    };
}

export const getOrderDetail = async (req: CustomRequest, res: Response) => {
    try {
        const {id} = req.params

        const transaction = await Transaction.findById(id).select("seats movie theater date status").populate({
            path: "movie",
            select: "thumbnail title genre -_id",
            populate: {
                path: "genre",
                select: "name -_id"
            }
        }).populate({
            path: "seats",
            select: "seat -_id"
        }).populate({
            path: "theater",
            select: "name city -_id"
        })


        return res.json({
            data: transaction,
            message: "Transaction Detail fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching Data:", error);
        return res.json({
            data: null,
            message: "Error fetching Data",
            status: 500
        });
    };
}
