import mongoose from 'mongoose'

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Mongo Db connected');
    }
    catch(error){
        console.error(error);
    }
}

export default connectDB;