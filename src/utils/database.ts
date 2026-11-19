import mongoose from 'mongoose';

export default function connectDB() {
    const DATABAESE_URL = process.env.DATABASE_URL ?? '';

    try {
        mongoose.connect(DATABAESE_URL);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    }

    const dbConn = mongoose.connection;

    dbConn.on('open', () => {
        console.log(`Database connected to ${DATABAESE_URL}`);
    });

    dbConn.on('error', (err) => {
        console.error(`Database connection error: ${err}`);
    });
}