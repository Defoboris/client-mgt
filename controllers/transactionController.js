const Transaction = require("../db/models/transaction");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Create a new transaction
const createTransaction = catchAsync(async (req, res, next) => {
    const {
        operator = '',
        deviceId = '',
        amount = '',
        phoneNumber = '',
        message = '',
        status = '',
        senderStatus = ''
    } = req.body;

    const newTransaction = await Transaction.create({
        operator,
        deviceId,
        amount,
        phoneNumber,
        message,
        status
    });

    // Optional update if senderStatus is 'completed'
    if (senderStatus === 'completed') {
        newTransaction.status = senderStatus;
        await newTransaction.save();
    }

    res.status(201).json({
        status: 'success',
        data: newTransaction
    });
});

// Get all transactions
const getAllTransactions = catchAsync(async (req, res, next) => {
    const transactions = await Transaction.findAll();

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: transactions
    });
});

// Get transaction by ID
const getTransactionById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
        return next(new AppError('Transaction not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: transaction
    });
});

// Get transactions by Device ID
const getTransactionByDeviceId = catchAsync(async (req, res, next) => {
    const { deviceId } = req.params;

    console.log(req.params);

    const transactions = await Transaction.findAll({
        where: { 
            deviceId: deviceId
         }
    });

    if (!transactions || transactions.length === 0) {
        return next(new AppError('No transactions found for this device ID', 404));
    }

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: transactions
    });
});

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    getTransactionByDeviceId
};
