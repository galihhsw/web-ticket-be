import type { Request, Response } from "express";
import Wallet from "../models/Wallet";
import type { CustomRequest } from "../types/Request";
import WalletTransaction from "../models/WalletTransaction";
import { topupSchema } from "../utils/zodSchema";
import { email } from "zod";

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


export const topupBalance = async  (req: CustomRequest, res: Response) => {
    try {
        const parse = topupSchema.parse(req.body)

        const midtransUrl = process.env.MIDTRANS_TRANSACTION_URL ?? ""
        const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? ""
        
        const wallet = await Wallet.findOne({
            user: req?.user?.id
        })

        const topup = new WalletTransaction({
            wallet: wallet?.id,
            price: parse.balance,
            status: "pending"
        })

        const midtransRequest = new Request(midtransUrl, {
            method: "POST",
            body: JSON.stringify({
                transaction_details: {
                    order_id: topup.id,
                    gross_amount: parse.balance,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    email: req.user?.email,
                },
                callbacks: {
                    finish: process.env.SUCCESS_PAYMENT_REDIRECT
                }
            }),
            headers: {
                Accept: "application/json",
                "Content-Type" : "application/json",
                Authorization: `BASIC ${midtransAuth}`
            }
        });

        const midtransResponse = await fetch(midtransRequest)
        const midtransJson = await midtransResponse.json()

        await topup.save()

        return res.json({ 
            data: midtransJson,
            message: "Balance Top up Success",
            status: true
        })

    } catch (error) {  
        console.error("Error top up balance:", error);
        return res.json({
            data: null,
            message: "Error top up balance",
            status: 500
        });
    };
};