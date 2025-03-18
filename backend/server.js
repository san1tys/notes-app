require("dotenv").config();
const app = require("./app");
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/notes-app/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/notes-app/dist", "index.html"));
    });
}

connectDB();

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});