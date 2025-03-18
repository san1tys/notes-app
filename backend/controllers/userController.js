const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const user = new User({
        fullname,
        email,
        password: hashedPassword
    });

    await user.save();

    const accessToken = jwt.sign({ user: { _id: user._id, email: user.email, fullname: user.fullname } }, process.env.ACCESS_TOKEN, { expiresIn: "10h" });

    return res.json({ error: false, user, accessToken, message: "Registration Successful" });
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

    return res.json({ error: false, email, accessToken, message: "Login Successful" });
};

exports.getUser = async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: { fullname: isUser.fullname, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn },
        message: ""
    });
};