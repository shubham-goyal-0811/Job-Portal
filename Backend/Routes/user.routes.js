import express from 'express';
import { login, logout, register, updateProfile } from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';


const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated,logout);
router.route("/profile/update").patch(isAuthenticated,updateProfile);


export default router;