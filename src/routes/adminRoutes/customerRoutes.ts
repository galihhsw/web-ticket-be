import express from "express"
import { getCustomers, getTransactions, getWalletTransactions } from "../../controllers/customerController";
import { validateRequest } from "../../middlewares/validateRequest";
import { genreSchema } from "../../utils/zodSchema";


const genreRoutes = express.Router()

genreRoutes.get('/customers', getCustomers)
genreRoutes.get('/wallet-transactions', getWalletTransactions)
genreRoutes.get('/ticket-transactions', getTransactions)


export default genreRoutes;

