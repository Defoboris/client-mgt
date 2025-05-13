const express = require('express');
const { authentication, restrictTo } = require('../controllers/authController');
const { createTransaction, getAllTransactions, getTransactionById, getTransactionByDeviceId } = require('../controllers/transactionController');

const router = express.Router();

router
    .route('/')
    .post(authentication, restrictTo('1'), createTransaction)
    .get(authentication, restrictTo('1'), getAllTransactions);

router
    .route('/:id')
    .get(authentication, restrictTo('1'), getTransactionById);

router
    .route('/device/:deviceId')
    .get(authentication, restrictTo('1'), getTransactionByDeviceId);

module.exports = router;