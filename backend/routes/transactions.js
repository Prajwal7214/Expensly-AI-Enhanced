const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator'); // FIX: [Server-side Input Validation]
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// FIX: [Pagination for Transactions] GET with page and limit
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .skip(skip) // FIX: [Pagination]
      .limit(limit);

    const total = await Transaction.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      count: transactions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: transactions
    });
  } catch (error) {
    next(error); // FIX: [Global Error Handler]
  }
});

// FIX: [Server-side Input Validation] POST validation
const transactionValidation = [
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Please provide a valid date')
];

router.post('/', auth, transactionValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { type, description, amount, category, date } = req.body;
    
    const transaction = new Transaction({
      userId: req.userId,
      type,
      description,
      amount,
      category,
      date
    });
    
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;