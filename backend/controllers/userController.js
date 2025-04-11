const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const setTokenCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'Strict' : 'Lax',
        maxAge: 10 * 60 * 60 * 1000
    });
};


exports.createAccount = async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullname, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign(
        { user: { _id: user._id, email: user.email, fullname: user.fullname } },
        process.env.ACCESS_TOKEN,
        { expiresIn: "10h" }
    );

    setTokenCookie(res, accessToken);

    return res.status(201).json({ error: false, user, message: "Registration Successful" });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const userInfo = await User.findOne({ email });
    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, userInfo.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: true, message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
        { user: { _id: userInfo._id, email: userInfo.email, fullname: userInfo.fullname } },
        process.env.ACCESS_TOKEN,
        { expiresIn: "10h" }
    );

    setTokenCookie(res, accessToken);

    return res.status(200).json({
        error: false,
        user: { _id: userInfo._id, fullname: userInfo.fullname, email: userInfo.email },
        message: "Login Successful"
    });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;
    const message = `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link is valid for 10 minutes.</p>
    `;

    try {
        await sendEmail(user.email, "Reset your password", message);
        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ error: true, message: "Failed to send email" });
    }
};


exports.resetPassword = async (req, res) => {
    const { token, email, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        email,
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ error: true, message: "Token is invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
};



exports.logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};


exports.getUser = async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullname: isUser.fullname,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        },
        message: ""
    });
};
