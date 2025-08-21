const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 📌 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 LOGOUT
exports.logout = async (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully (remove token on client)",
    });
};

// 📌 GET USERS (Admin only)
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Admin privileges required",
        });
    }

    const search = req.query.search || null;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const role = req.query.role || null;
    const skip = (page - 1) * limit;

    let queryObject = {};
    if (search) queryObject.name = { $regex: search, $options: "i" };
    if (role) queryObject.role = role;

    const users = await User.find(queryObject)
      .select("-password -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocs = await User.countDocuments(queryObject);
    const totalPages = Math.ceil(totalDocs / limit);

    res.status(200).json({
      success: true,
      count: users.length,
      totalPages,
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching users" });
  }
};

// 📌 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, currency } = req.body;
    const updates = {};
    const allowedUpdates = ["name", "avatar", "currency"];

    Object.keys(req.body).forEach((update) => {
      if (allowedUpdates.includes(update)) updates[update] = req.body[update];
    });

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid updates provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
