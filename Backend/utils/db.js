import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { DB_NAME } from './constants.js';

dotenv.config({});
const connectDB = async()=>{
    try{
        
        await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`);
        console.log('Mongo Db connected');
    }
    catch(error){
        console.error(error);
    }
}

export default connectDB;