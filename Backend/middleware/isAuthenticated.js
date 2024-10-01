import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { User } from '../models/user.model.js';
const isAuthenticated = async (req,res,next) => {
    try{
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                message: "User not authorized to perform this action",
                success : false
            })
        }
        const decode = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decode){
            return res.status(401).json({
                message: "Invalid token",
                success : false
            })
        }
        console.log(decode?.userId)
        req.id = await User.findById(decode?.userId);
        next();
    }
    catch(error){
        console.log(error)
    }
}

export default isAuthenticated;