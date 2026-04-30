const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // FIX: [Server-side Input Validation]
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.json({ success: true, data: budgets });
  } catch (error) {
    next(error); // FIX: [Global Error Handler]
  }
});

// FIX: [Server-side Input Validation]
const budgetValidation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('limit').isFloat({ min: 0.01 }).withMessage('Limit must be a positive number'),
  body('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid period')
];

router.post('/', auth, budgetValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { category, limit, period } = req.body;

    const budget = new Budget({
      userId: req.userId,
      category,
      limit,
      period: period || 'monthly'
    });

    await budget.save();
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Budget for this category already exists' });
    }
    next(error);
  }
});

router.put('/:id', auth, [
  body('limit').optional().isFloat({ min: 0.01 }).withMessage('Limit must be a positive number'),
  body('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid period')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { limit, period } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { limit, period },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;