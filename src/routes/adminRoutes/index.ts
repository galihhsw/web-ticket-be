import express from 'express';
import genreRoutes from './genresRoute';

const adminRoutes = express.Router();

adminRoutes.use(genreRoutes)

export default adminRoutes;