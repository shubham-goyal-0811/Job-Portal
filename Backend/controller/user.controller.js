import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


export const register = async (req,res) =>{
    try{
        const {fullName,email,phoneNumber,password,role} = req.body;
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                    message : "Something is missing",
                    success : false,
                }
            );
        };
        const user = User.findOne({email});
        if(user){
            return res.status(400).json({
                message : "User already exists with this email",
                success : false
            });
        };
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullName,
            email,
            phoneNumber,
            password : hashedPassword,
            role,

        })
        return res.status(200).json({
            message : "user created succesfully",
            success : true
        })
    }
    catch(error){
        console.log(error);
    }
}

export const login = async(req,res)=>{
    try{
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message : "something is missing",
                success : false
            });
        };

        const user = User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : "User does not exist with this email",
                success : false
            });
        };

        const isPassCorrect = await bcrypt.compare(password,user.password);
        if(!isPassCorrect){
            return res.status(401).json({
                message:"Incorrect password",
                success : false,
            });
        };

        if(role !== user.role){
            return res.status(401).json({
                message : "accound does not exist wioth current role",
                success : false
            });
        };

        const tokenData = {
            userId : user._id,
        } 
        const token = await jwt.sign(tokenData,process.env.ACCESS_TOKEN_SECRET, {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpOnly : true, sameSite : 'strict'}).json({
            message : `welcome back ${user.fullName}`,
            success:true,
            user
        })
    }
    catch(error){
        console.log(error);
    }
} 

export const logout = async (req,res)=>{
    
}   