// All the types of routing existing in the AUTH centric part of scope

import express from "express";
import {
  register,
  login,
  logout,
  verify,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sentverifyotp", userAuth, verify);
router.post("/verifyaccount", userAuth, verifyEmail);
router.post("/isAuth", userAuth, isAuthenticated);
router.post("/sendresetotp", sendResetOtp);
router.post("/resetpassword", resetPassword);

export default router;