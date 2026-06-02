import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";


// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Register Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};



// LOGIN USER
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("Login Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};



// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json(user);

  } catch (error) {

    console.log("Get Current User Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};