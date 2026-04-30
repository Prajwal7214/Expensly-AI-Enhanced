// Test if routes can be imported
console.log('Testing route imports...');

try {
  const authRoutes = require('./routes/auth');
  console.log('✅ auth.js loaded:', typeof authRoutes);
} catch (e) {
  console.error('❌ auth.js error:', e.message);
}

try {
  const transactionRoutes = require('./routes/transactions');
  console.log('✅ transactions.js loaded:', typeof transactionRoutes);
} catch (e) {
  console.error('❌ transactions.js error:', e.message);
}

try {
  const budgetRoutes = require('./routes/budgets');
  console.log('✅ budgets.js loaded:', typeof budgetRoutes);
} catch (e) {
  console.error('❌ budgets.js error:', e.message);
}

try {
  const savingsRoutes = require('./routes/savings');
  console.log('✅ savings.js loaded:', typeof savingsRoutes);
} catch (e) {
  console.error('❌ savings.js error:', e.message);
}

console.log('Test complete!');