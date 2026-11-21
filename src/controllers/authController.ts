import type { Request, Response } from "express";
import { authSchema } from "../utils/zodSchema";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Wallet from "../models/Wallet";

export const login = async (req: Request, res: Response) => {
    try {
        const parse = authSchema.omit({
            name: true
        }).parse(req.body)

        const checkUser = await User.findOne({
            email: parse.email,
            role: parse.role
        })

        if (!checkUser) {
            return res.status(400).json({
                message: "Email not registered",
                data: null,
                status: 400
            })
        }

        const comparePassword = bcrypt.compareSync(parse.password, checkUser.password) 

        if (!comparePassword) {
            return res.status(400).json({
                message: "Email or Password incorrect",
                data: null,
                status: 400
            })
        }

        const secretKey = process.env.SECRET_KEY ?? ""

        const token = jwt.sign({
            data: {
                id: checkUser.id
            }
        }, secretKey, {expiresIn:'24h'})

        return res.json({
            message: "Login Success",
            data: {
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
                photoUrl: checkUser.photoUrl,
                token,
            },
            status: 200
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to Login",
            data: null,
            status: 500
        })
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const parse = authSchema.omit({
            role: true
        }).safeParse(req.body)

        if (!parse.success) {
            const errorMessages = parse.error.issues.map((err) => err.message)

            return res.status(400).json({
                message: "invalid Request",
                data: errorMessages,
                status: 500
            })
        }

        const emailExisted = await User.findOne({
            email: parse.data.email
        })

        if (emailExisted) {
            return res.status(400).json({
                message: "Email already exist",
                data: null,
                status: 400
            })
        }

        const hashPassword = bcrypt.hashSync(parse.data.password, 12)

        const user = new User({
            name: parse.data.name,
            email: parse.data.email,
            password: hashPassword,
            role: "customer",
            photo: req.file?.filename
        })

        const wallet = new Wallet({
            balance: 0,
            user: user._id
        })

        await user.save()
        await wallet.save()

        return res.json({
            message: "Register Success",
            data: {
                name: user.name,
                email: user.email
            },
            status: 200
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to Register",
            data: null,
            status: 500
        })
    }
}