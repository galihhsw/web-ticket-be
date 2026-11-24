import type { Request, Response } from "express";
import Wallet from "../models/Wallet";
import type { CustomRequest } from "../types/Request";
import WalletTransaction from "../models/WalletTransaction";

export const getBalance = async (req: CustomRequest, res: Response) => {
    try {
        const wallet = await Wallet.findOne({
            user: req.user?.id
        });

        return res.json({
            data: {
                balance: wallet?.balance ?? 0 
            },
            message: "Wallet fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching wallet:", error);
        return res.json({
            data: null,
            message: "Error fetching wallet",
            status: 500
        });
    };
};


export const getTopupHistory = async (req: CustomRequest, res: Response) => {
    try {
        const wallet = await Wallet.findOne({
            user: req.user?.id
        });

        const data = await WalletTransaction.find({
            wallet: wallet?._id
        }).select("wallet price createdAt status")

        return res.json({
            data: data,
            message: "Wallet transactions data fetched successfully",
            status: 200
        })

    } catch (error) {  
        console.error("Error fetching wallet transactions data:", error);
        return res.json({
            data: null,
            message: "Error fetching wallet transactions data",
            status: 500
        });
    };
};
