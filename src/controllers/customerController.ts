import type { Request, Response } from "express";
import { genreSchema } from "../utils/zodSchema";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import TransactionSeat from "../models/TransactionSeat";
import Transaction from "../models/Transaction";


export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await User.find({role: "customer"}).select("name email");

        return res.json({
            data: customers,
            message: "Users Data fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching users data:", error);
        return res.json({
            data: null,
            message: "Error fetching users data",
            status: 500
        });
    };
};

export const getWalletTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await WalletTransaction.find().populate({
             path: "wallet",
             select: "user -_id",
             populate: {
                path: "user",
                select: "name"
             }
        });

        return res.json({
            data: transactions,
            message: "Transactions Data fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching Transactions data:", error);
        return res.json({
            data: null,
            message: "Error fetching Transactions data",
            status: 500
        });
    };
};


export const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find()
            .populate({
                path: "user",
                select: "name -_id",
            })
            .populate({
                path: "movie",
                select: "title -_id",
            })
            .populate({
                path: "theater",
                select: "name -_id",
            });

        return res.json({
            data: transactions,
            message: "Transactions Data fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching Transactions data:", error);
        return res.json({
            data: null,
            message: "Error fetching Transactions data",
            status: 500
        });
    };
};
