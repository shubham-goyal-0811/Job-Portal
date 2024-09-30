import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
dotenv.config({})
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin : "http://localhost:5173",
    credentials : true,

}
app.use(cors(corsOptions));

const port = process.env.PORT
app.listen(port || 8000,(req,res)=>{
    connectDB();
    console.log("server is live at port",port);

})
