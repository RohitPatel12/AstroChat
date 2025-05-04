import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import sendEmail from '../utils/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import uploadImageClodinary from '../utils/uploadImageCloudinary.js';

// === Register User ===
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Provide name, email, and password", error: true, success: false });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", error: true, success: false });
    }

    const newUser = new UserModel({ name, email, password });
    const savedUser = await newUser.save();

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;
    await sendEmail({
      sendTo: email,
      subject: "Verify email from BinkeyIT",
      html: verifyEmailTemplate({ name, url: verifyUrl }),
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      error: false,
      data: { _id: savedUser._id, name, email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// === Login User ===
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password", error: true, success: false });
    }

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials", error: true, success: false });
    }

    const isMatch = await bcryptjs.compare(String(password).trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", error: true, success: false });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true, secure: true, sameSite: "None", maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, secure: true, sameSite: "None", maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await UserModel.findByIdAndUpdate(user._id, { last_login_date: new Date() });

    return res.json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Authentication failed", error: true, success: false });
  }
}

// === Logout User ===
export async function logoutUserController(req, res) {
  try {
    const userId = req.userId;

    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });

    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

    return res.json({ message: "Logout successful", success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// === Upload Avatar ===
export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;
    const image = req.file;

    const uploaded = await uploadImageClodinary(image);
    await UserModel.findByIdAndUpdate(userId, { avatar: uploaded.url });

    return res.json({ 
      message: "Avatar uploaded", 
      success: true, 
      error: false, 
      data: { _id: userId, avatar: uploaded.url } 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// === Get User Profile ===
export async function getUserProfile(req, res) {
  try {
    const user = await UserModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

// === Update User Profile ===
export async function updateUserProfile(req, res) {
  try {
    const user = await UserModel.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const { name, email, phone, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

// === Verify Email ===
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findById(code);
    if (!user) {
      return res.status(400).json({ message: "Invalid code", error: true, success: false });
    }

    await UserModel.updateOne({ _id: code }, { verify_email: true });

    return res.json({
      message: "Email verified successfully",
      success: true,
      error: false
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// === Reset Password ===
export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields: email, newPassword, confirmPassword",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found", error: true, success: false });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match", error: true, success: false });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res.json({
      message: "Password updated successfully",
      success: true,
      error: false
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}
