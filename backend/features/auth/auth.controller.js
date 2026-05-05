const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const AppError = require("../../utils/AppError");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const register = async (req, res, next) => {
  try {
    console.log("📩 Register hit — body:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Name, email and password are required", 400));
    }

    console.log("🔍 Checking existing user...");
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return next(new AppError("Email already registered", 400));

    console.log("💾 Creating user...");
    const user = await User.create({ name, email, password });

    console.log("✅ User created:", user._id);
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err.name, "—", err.message);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    console.log("📩 Login hit — email:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError("Email and password required", 400));

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid credentials", 401));
    }

    console.log("✅ Login successful:", user._id);
    const token = signToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.name, "—", err.message);
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
