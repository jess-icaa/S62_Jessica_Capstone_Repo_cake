const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); // ✅ moved here


// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prevent role injection
    const allowedRole = role === "admin" ? "admin" : "customer";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: allowedRole,
    });

    // ✅ SEND RESPONSE FIRST (important)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });

    // ✅ SEND EMAIL AFTER RESPONSE (non-blocking)
try {
  await sendEmail(
    user.email,
    "Welcome to Jesmer Cakes 🎂",
    `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fdf7f9; padding: 30px;">
      
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

        <h2 style="color: #e75480; margin-bottom: 10px;">
          Welcome to Jesmer Cakes 🎂
        </h2>

        <p style="font-size: 16px; color: #444;">
          Hi <strong>${user.name}</strong>,
        </p>

        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          We’re so happy you’re here 💖<br/>
          At Jesmer Cakes, every creation is crafted with love, creativity, and a little bit of magic ✨
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #fff0f5; border-radius: 10px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            🎂 Design your dream cake<br/>
            🍰 Explore delicious creations<br/>
            💕 Made just for you
          </p>
        </div>

        <p style="font-size: 15px; color: #555;">
          We can’t wait for you to create something amazing with us.
        </p>

        <p style="margin-top: 20px; font-size: 14px; color: #888;">
          With love,<br/>
          <strong>Team Jesmer 💗</strong>
        </p>

      </div>

    </div>
    `
  );
} catch (emailError) {
  console.error("Email failed:", emailError.message);
}

  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};


// ======================
// LOGIN USER
// ======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting account",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser
};