import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    // console.log(req.body);
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
    return res.status(200).json({
      message: "user created succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist with this email",
        success: false,
      });
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(401).json({
        message: "accound does not exist wioth current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    user = {
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `welcome back ${user.fullName}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).cookie("token", null, { maxAge: 0 }).json({
      message: "Logout succesfull",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    console.log(req.body);
    const file = req.file;
    if (!fullName && !email && !phoneNumber && !bio && !skills) {
      return res.status(400).json({
        message: "Insufficient Data",
        success: false,
      });
    }

    //upload on cloudinary
    //#TODO: Upload on cloudinary

    const skillsArray = skills?.split(",");
    console.log(bio);
    console.log(skillsArray);
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (email) {
      user.email = email;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (bio) {
      user.profile.bio = bio;
    }

    if (skillsArray) {
      user.profile.skills = skillsArray.toString();
    }

    //Resume to be added

    await user.save();

    user = {
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
      email: user.email,
    };

    return res.status(200).json({
      message: "Profile Updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};
