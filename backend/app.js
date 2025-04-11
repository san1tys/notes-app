require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);


app.use(errorHandler);

module.exports = app;