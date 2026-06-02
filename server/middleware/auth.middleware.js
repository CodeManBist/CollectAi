import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {

  try {

    let token;

    // check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // attach user
      req.user = await User.findById(decoded.id).select("-password");

      next();

    } else {

      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

  } catch (error) {

    console.log("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};