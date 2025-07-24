import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/dbConnect';
import rootRouter from './routes/index.routes';

dotenv.config() 
connectDB()



const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

// cors
app.use(
    cors({
        origin: (_origin, callback) => callback(null, true),
        credentials: true,
    })
);

//routes
app.use("/api/v1", rootRouter);
app.get('/', (req, res) => {
    res.send('Server Health Check: OK');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})