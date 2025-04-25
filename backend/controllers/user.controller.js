import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, cnic } = req.body;
        if (!name || !email || !cnic) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists. Email and CNIC should be unique." });

        const password = name + email + cnic + Math.random();
        const newUser = new User({ name, email, password, cnic });
        await newUser.save();

        await sendEmail({
            to: email,
            subject: "Welcome to Saylani Microfinance!",
            text: `Hi ${name},\n\nYour password is "${password}"`,
        });

        return res.status(201).json({ newUser, message: "User created Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password!" });
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);


        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "Lax",
        }

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({ loggedInUser, accessToken, refreshToken, message: "Logged in successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        const user = req.user;

        await User.findByIdAndUpdate(
            user._id,
            {
                $unset: { refreshToken: 1 }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
        }

        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({ message: "User logged out" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(401).json({ message: "Password should be same" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = password;
        user.isPasswordChanged = true;
        const updatedUser = await user.save();

        return res.status(200).json({ updatedUser, message: "Password changed successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword
};