import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import mongan from 'morgan'
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoute from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors';

//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middelware
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use(morgan('dev'));

//routes
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);

//rest api
app.get('/',(req,res) => {
    res.send("<h1>Welcome to Ecommerce App</h1>")
})

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on ${PORT}` .black.bold .bgWhite);
});

