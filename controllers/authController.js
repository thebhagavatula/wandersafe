import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; 
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email }); // Fix typo: exixtingUser to existingUser
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    const mail = {
      from: {
        name: "Your Website Name",
        address: process.env.SENDER_EMAIL,  // Ensure this email is verified
      },
      to: email, // Ensure this is a valid recipient email
      subject: "Account Activation Link",
      text: `Welcome to 'Website Name'. Your account has been created with email id: ${email}.`,
    };
    
    await transporter.sendMail(mail);

    return res.json({ success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => { 
  try {
    res.cookie("token", "", { // Clear the token cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 0,
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await User.findById(userID); // Reference User model instead of `user`

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 600000; // 10 minutes

    await user.save();

    const mail = {
      from: {
        name: "Your Website Name",
        address: process.env.SENDER_EMAIL, // Ensure this email is verified
      },
      to: user.email, // Ensure this is a valid recipient email
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is ${otp}.`,
    };

    await transporter.sendMail(mail);

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Verify the Email using OTP
export const verifyEmail = async (req, res) => { 
  const { userID, otp }  = req.body;

  if(!userID || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await User.findById(userID);

    if(!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if(user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    if(user.verifyOtp !== otp || user.verifyOtp === '') {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if(user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Account Verified" });
  }
  catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try{
    return res.json({success: true});

  }catch(error) {
    return res.json({success: false, message: error.message});
  }

}

//Forgot Password
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.status(400).json({success: false, message: "Email is required"});
  }

  try {
    const user = await User.findOne({email});

    if(!user) {
      return res.status(400).json({success: false, message: "User not found"});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 600000; // 10 minutes

    await user.save();

    const mail = {
      from: {
        name: "Your Website Name",
        address: process.env.SENDER_EMAIL, // Ensure this email is verified
      },
      to: user.email, 
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}.
      Use this OTP to proceed with resetting your password.`
    };

    await transporter.sendMail(mail);

    return res.json({success: true, message: "OTP sent successfully"});


  }catch(error) {
    return res.json({success: false, message: error.message});
  }
}

//Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if(!email || !otp || !newPassword) {
    return res.status(400).json({success: false, message: "Missing Details"});
  }

  try {
    const user = await User.findOne({email});

    if(!user) {
      return res.status(400).json({success: false, message: "User not found"});
    }

    if(user.resetOtp !== otp || user.resetOtp === '') {
      return res.status(400).json({success: false, message: "Invalid OTP"});
    }

    if(user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({success: false, message: "OTP Expired"});
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({success: true, message: "Password has beeen reset Successfully"});

  }catch(error) {
    return res.json({success: false, message: error.message});
  }
}
