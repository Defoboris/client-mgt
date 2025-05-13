require('dotenv').config();
const express = require('express');

const authRouter = require('./routes/authRouter');
const projectRouter = require('./routes/projectRouter');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const PORT = process.env.APP_PORT;

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);

// Ropute don't match 
app.use(catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log("Listening on port:", PORT);
});
