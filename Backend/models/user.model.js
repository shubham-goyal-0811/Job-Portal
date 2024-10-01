import mongoose, { Mongoose } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    phoneNumber :{
        type : Number,
        required : true,
    },
    password :{
        type : String,
        required : true
    },
    role:{
        type : String,
        enum : ['Student','Recruiter'],
        required : true
    },
    profile:{
        bio :{type : String},
        skills : {type: String},
        resume : {type : String},// URL OF RESUME
        resumeOriginalName : {type : String},
        company : {type : mongoose.Schema.Types.ObjectId, ref : 'Company'},
        profilePhoto :{type : String, default: null},
    }
},
{timestamps : true});

export const User = mongoose.model('User',userSchema);