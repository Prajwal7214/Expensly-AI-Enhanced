const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // FIX: [Server-side Input Validation]
const SavingsGoal = require('../models/SavingsGoal');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.userId })
      .sort({ deadline: 1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error); // FIX: [Global Error Handler]
  }
});

// FIX: [Server-side Input Validation]
const savingsValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('targetAmount').isFloat({ min: 0.01 }).withMessage('Target amount must be a positive number'),
  body('deadline').isISO8601().custom(value => {
    if (new Date(value) <= new Date()) {
      throw new Error('Deadline must be a future date');
    }
    return true;
  })
];

router.post('/', auth, savingsValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, targetAmount, currentAmount, deadline } = req.body;

    const goal = new SavingsGoal({
      userId: req.userId,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline
    });

    await goal.save();
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, [
  body('currentAmount').isFloat({ min: 0 }).withMessage('Current amount must be a non-negative number')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentAmount } = req.body;

    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { currentAmount },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;