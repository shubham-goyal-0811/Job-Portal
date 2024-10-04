import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './Routes/user.routes.js';
import companyRoute from './Routes/company.routes.js';
import jobRoute from './Routes/jobs.routes.js';
import applicationRoute from './Routes/application.routes.js'; 

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
app.use('/api/v1/user',userRoute);
app.use('/api/v1/company',companyRoute);
app.use('/api/v1/jobs',jobRoute);
app.use('/api/v1/application',applicationRoute);