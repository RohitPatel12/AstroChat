import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generatedAccessToken.js";

export const registerUserController = async (req, res) => {
    try {
        // 1. Destructure first
        const { name, email, password } = req.body;
  
        // 2. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please enter all fields",
                success: false,
                error: true
            });
        }

        // 3. Check for existing user
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                message: "User already registered",
                success: false,
                error: true
            });
        }

        // 4. Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // 5. Return success response
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Server error during registration",
            error: true
        });
    }
};

export const loginUserController = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email }).select("+password");
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } catch (err) {
      res.status(500).json({ message: "Login failed", error: err.message });
    }
  };
 
  export const getUserProfile = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not found from getUserProfile" });
      }
  
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Error in getUserProfile:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };