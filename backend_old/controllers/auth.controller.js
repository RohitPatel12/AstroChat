import UserModel from '../models/user.model.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedAccessToken.js';
import bcryptjs from 'bcryptjs';

// CONTROLLERS

// Register User
export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: "Provide name, email, and password", error: true, success: false });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "Email already registered", error: true, success: false });
    }

    // const salt = await bcryptjs.genSalt(10);
    // const hashedPassword = await bcryptjs.hash(String(password), salt);

    const newUser = await new UserModel({ name, email, password}).save();

    // TODO: Implement sendEmail and verifyEmailTemplate

    return response.status(201).json({
      message: "User registered successfully",
      success: true,
      error: false,
      data: newUser
    });

  } catch (error) {
    return response.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Login User
export async function loginUserController(request, response) {
  try {
    const { email, password } = request.body;

    console.log("DEBUG | Incoming login request:", { email, password });

    // 1. Validate input
    if (!email || !password) {
      return response.status(400).json({ 
        message: "Please provide email and password", 
        error: true, 
        success: false 
      });
    }

    // 2. Find user with password field
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      console.log("DEBUG | No user found with that email");
      return response.status(400).json({ 
        message: "Invalid credentials", 
        error: true, 
        success: false 
      });
    }

    console.log("DEBUG | Retrieved user from DB:", {
      email: user.email,
      hashedPassword: user.password
    });

    if (!user.password) {
      console.log("ERROR | Password is undefined in DB");
      return response.status(500).json({
        message: "Password field not found in user record",
        error: true,
        success: false
      });
    }

    // 3. Sanitize and compare passwords
    const inputPassword = String(password).trim();
    console.log("DEBUG | Comparing passwords", {
      inputPassword,
      storedHashedPassword: user.password
    });

    const isMatch = await bcryptjs.compare(inputPassword, user.password);

    if (!isMatch) {
      console.log("DEBUG | Passwords do not match");
      return response.status(400).json({ 
        message: "Invalid credentials", 
        error: true, 
        success: false 
      });
    }

    console.log("DEBUG | Passwords match! Proceeding to token generation");

    // 4. Generate tokens
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    // 5. Set secure cookies
    response.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      secure: true, 
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 6. Update last login
    await UserModel.findByIdAndUpdate(user._id, { 
      last_login_date: new Date() 
    });

    // 7. Return success
    console.log("DEBUG | Login successful");
    return response.json({
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
    console.error("ERROR | Login error:", error);
    return response.status(500).json({ 
      message: "Authentication failed", 
      error: true, 
      success: false 
    });
  }
}

// Logout User
export async function logoutUserController(request, response) {
  try {
    const userId = request.userId;

    response.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" });
    response.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });

    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

    return response.json({ message: "Logout successful", success: true, error: false });
  } catch (error) {
    return response.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Upload Avatar
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId;
    const image = request.file;

    const uploaded = await uploadImageClodinary(image);

    await UserModel.findByIdAndUpdate(userId, { avatar: uploaded.url });

    return response.json({ message: "Avatar uploaded", success: true, error: false, data: { _id: userId, avatar: uploaded.url } });
  } catch (error) {
    return response.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Update User Details
export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId;
    const { name, email, mobile, password } = request.body;

    const updateData = { ...name && { name }, ...email && { email }, ...mobile && { mobile } };
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(password, salt);
    }

    const update = await UserModel.updateOne({ _id: userId }, updateData);

    return response.json({ message: "User updated", success: true, error: false, data: update });
  } catch (error) {
    return response.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Other controllers (forgotPassword, resetPassword, refreshToken, userDetails) follow the same pattern.
// For brevity, not all are included here but can be structured similarly with validation, clear error handling, and clean code.