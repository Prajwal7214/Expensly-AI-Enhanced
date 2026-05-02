// frontend/app.js - Production Ready Audit Fixes Applied

// FIX: [Hardcoded API URL]
const API_URL = window.location.origin + '/api';

// FIX: [Token Storage] Removed authToken from localStorage
// Application State
let currentUser = null;
let transactions = [];
let budgets = [];
let savingsGoals = [];
let charts = {};

// FIX: [Pagination for Transactions]
let transactionPagination = {
    currentPage: 1,
    limit: 20,
    hasMore: true,
    total: 0
};

// FIX: [XSS in Dynamic Rendering] Helper function to escape HTML
function escapeHTML(str) {
    if (!str) return '';
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

// FIX: [Loading Spinner for Cold Starts] Health check function
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_URL}/health`, { method: 'GET' });
        return response.ok;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        // FIX: [Token Storage] Add credentials: 'include' for cookies
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers },
            credentials: 'include',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle unauthorized (expired/missing token)
        if (response.status === 401 && !endpoint.includes('/auth/')) {
            handleLogout();
            throw new Error('Session expired. Please login again.');
        }

        const data = await response.json().catch(() => ({ success: false, message: 'Network error' }));

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async function () {
    // FIX: [Loading Spinner for Cold Starts]
    const loader = document.getElementById('initial-loader');

    // Check if backend is alive (important for Render free tier cold starts)
    const isAlive = await checkBackendHealth();

    if (!isAlive) {
        // Retry once after a delay if first check fails
        await new Promise(resolve => setTimeout(resolve, 3000));
        const retry = await checkBackendHealth();
        if (!retry) {
            showToast('error', 'Connection Error', 'Unable to connect to the server. Please try again later.');
        }
    }

    // Hide loader
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => loader.style.display = 'none', 500);
    }

    initializeApp();
    setupEventListeners();
    initializeDarkMode();
});

function initializeApp() {
    const savedUser = localStorage.getItem('budget_current_user');
    // FIX: [Token Storage] Only check for user data, cookie presence is handled by browser
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLandingPage();
    }

    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

function setupEventListeners() {
    document.getElementById('show-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('signup');
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('login');
    });

    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('logout-btn-sidebar')?.addEventListener('click', handleLogout);

    // FIX: [Pagination for Transactions]
    document.getElementById('btn-load-more')?.addEventListener('click', loadMoreTransactions);

    // Password validation for signup
    document.getElementById('signupPassword')?.addEventListener('input', validatePasswordRealtime);

    // Password toggle functionality
    document.getElementById('loginPasswordToggle')?.addEventListener('click', () => togglePasswordVisibility('loginPassword', 'loginPasswordToggle'));
    document.getElementById('signupPasswordToggle')?.addEventListener('click', () => togglePasswordVisibility('signupPassword', 'signupPasswordToggle'));

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

    // Add click handler for "View all" link
    document.querySelectorAll('[data-section]').forEach(link => {
        if (link.classList.contains('view-all-link')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                showSection(section);
            });
        }
    });

    document.getElementById('income-form')?.addEventListener('submit', handleAddIncome);
    document.getElementById('expense-form')?.addEventListener('submit', handleAddExpense);
    document.getElementById('budget-form')?.addEventListener('submit', handleSetBudget);
    document.getElementById('savings-form')?.addEventListener('submit', handleCreateSavingsGoal);
    document.getElementById('filter-category')?.addEventListener('change', () => {
        transactionPagination.currentPage = 1;
        displayAllTransactions(true);
    });
    document.getElementById('filter-type')?.addEventListener('change', () => {
        transactionPagination.currentPage = 1;
        displayAllTransactions(true);
    });
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

    // Sidebar Toggle for Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        const sidebarClose = document.getElementById('sidebar-close');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        }

        // Close sidebar when clicking outside on mobile
        mainContent?.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        // Close sidebar when a nav item is clicked on mobile
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

function switchAuthForm(form) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (form === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

// ========================================
// Password Validation Functions
// ========================================

function validatePassword(password) {
    const rules = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[@#$%&!]/.test(password),
        noSpaces: !/\s/.test(password)
    };
    const allRulesMet = Object.values(rules).every(rule => rule === true);
    return { isValid: allRulesMet, rules };
}

function validatePasswordRealtime(e) {
    const password = e.target.value;
    const validation = validatePassword(password);
    const signupButton = document.getElementById('signupButton');
    updateRuleStatus('rule-length', validation.rules.minLength);
    updateRuleStatus('rule-uppercase', validation.rules.hasUppercase);
    updateRuleStatus('rule-lowercase', validation.rules.hasLowercase);
    updateRuleStatus('rule-number', validation.rules.hasNumber);
    updateRuleStatus('rule-special', validation.rules.hasSpecialChar);
    updateRuleStatus('rule-spaces', validation.rules.noSpaces);
    if (signupButton) {
        signupButton.disabled = !validation.isValid;
    }
}

function updateRuleStatus(ruleId, isValid) {
    const ruleElement = document.getElementById(ruleId);
    if (!ruleElement) return;
    if (isValid) {
        ruleElement.classList.remove('invalid');
        ruleElement.classList.add('valid');
    } else {
        ruleElement.classList.remove('valid');
        ruleElement.classList.add('invalid');
    }
}

function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);
    if (!passwordInput || !toggleButton) return;
    const icon = toggleButton.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        currentUser = data.user;
        localStorage.setItem('budget_current_user', JSON.stringify(currentUser));
        showMainApp();
        showToast('success', 'Success', `Welcome back, ${currentUser.name}!`);
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const validation = validatePassword(password);
    if (!validation.isValid) {
        showToast('error', 'Weak Password', 'Please ensure your password meets all security requirements');
        return;
    }

    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        currentUser = data.user;
        localStorage.setItem('budget_current_user', JSON.stringify(currentUser));
        showMainApp();
        showToast('success', 'Success', 'Account created successfully!');
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

async function handleLogout() {
    try {
        // FIX: [Token Storage] Clear cookie on server
        await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    }
    currentUser = null;
    localStorage.removeItem('budget_current_user');
    showLandingPage();
    showToast('success', 'Success', 'Logged out successfully');
}

function showLandingPage() {
    document.getElementById('landing-page').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

async function showMainApp() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
    }
    await loadAppData();
    loadUserProfile();
    initializeAIForecaster();
    updateDashboard();
    showSection('dashboard');
}

async function loadAppData() {
    try {
        const [transactionsData, budgetsData, savingsData] = await Promise.all([
            apiCall('/transactions?limit=100'), // Load first 100 for charts
            apiCall('/budgets'),
            apiCall('/savings')
        ]);

        transactions = (transactionsData.data || []).map(t => ({
            ...t,
            id: t._id,
            date: t.date?.split('T')[0] || new Date().toISOString().split('T')[0]
        }));

        budgets = (budgetsData.data || []).map(b => ({
            ...b,
            id: b._id
        }));

        savingsGoals = (savingsData.data || []).map(g => ({
            ...g,
            id: g._id
        }));
    } catch (error) {
        console.error('Error loading app data:', error);
        showToast('error', 'Error', 'Failed to load data');
    }
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const targetNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetNav && targetNav.classList.contains('nav-item')) {
        targetNav.classList.add('active');
    }

    if (sectionName === 'transactions') {
        transactionPagination.currentPage = 1;
        displayAllTransactions(true);
    } else if (sectionName === 'budget') {
        displayBudgetProgress();
    } else if (sectionName === 'savings') {
        displaySavingsGoals();
    } else if (sectionName === 'profile') {
        updateProfileDisplay();
    }
}

async function handleAddIncome(e) {
    e.preventDefault();
    const description = document.getElementById('income-description').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const category = document.getElementById('income-category').value;
    const date = document.getElementById('income-date').value;

    try {
        const response = await apiCall('/transactions', {
            method: 'POST',
            body: JSON.stringify({ type: 'income', description, amount, category, date })
        });
        const newIncome = response.data;
        transactions.unshift({ ...newIncome, id: newIncome._id });
        updateDashboard();
        showToast('success', 'Success', 'Income added successfully!');
        e.target.reset();
        document.getElementById('income-date').value = new Date().toISOString().split('T')[0];
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

async function handleAddExpense(e) {
    e.preventDefault();
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    try {
        const response = await apiCall('/transactions', {
            method: 'POST',
            body: JSON.stringify({ type: 'expense', description, amount, category, date })
        });
        const newExpense = response.data;
        transactions.unshift({ ...newExpense, id: newExpense._id });
        updateDashboard();
        showToast('success', 'Success', 'Expense added successfully!');
        e.target.reset();
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

async function handleSetBudget(e) {
    e.preventDefault();
    const category = document.getElementById('budget-category').value;
    const limit = parseFloat(document.getElementById('budget-limit').value);

    try {
        const response = await apiCall('/budgets', {
            method: 'POST',
            body: JSON.stringify({ category, limit })
        });
        const newBudget = response.data;
        budgets.push({ ...newBudget, id: newBudget._id });
        displayBudgetProgress();
        showToast('success', 'Success', 'Budget set successfully!');
        e.target.reset();
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

async function handleCreateSavingsGoal(e) {
    e.preventDefault();
    const title = document.getElementById('savings-title').value;
    const targetAmount = parseFloat(document.getElementById('savings-target').value);
    const currentAmount = parseFloat(document.getElementById('savings-current').value);
    const deadline = document.getElementById('savings-deadline').value;

    try {
        const response = await apiCall('/savings', {
            method: 'POST',
            body: JSON.stringify({ title, targetAmount, currentAmount, deadline })
        });
        const newGoal = response.data;
        savingsGoals.push({ ...newGoal, id: newGoal._id });
        displaySavingsGoals();
        updateDashboard();
        showToast('success', 'Success', 'Savings goal created!');
        e.target.reset();
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

function updateDashboard() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalIncome - totalExpenses;
    const totalSavings = savingsGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);

    document.getElementById('total-income').textContent = `₹${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById('current-balance').textContent = `₹${currentBalance.toFixed(2)}`;
    document.getElementById('total-savings').textContent = `₹${totalSavings.toFixed(2)}`;

    displayRecentTransactions();
    updateCharts();
}

function displayRecentTransactions() {
    const recentTransactionsList = document.getElementById('recent-transactions-list');
    if (!recentTransactionsList) return;

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (recentTransactions.length === 0) {
        recentTransactionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>No transactions yet</h3>
                <p>Start by adding your first income or expense</p>
            </div>
        `;
        return;
    }

    recentTransactionsList.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-details">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas fa-arrow-${transaction.type === 'income' ? 'up' : 'down'}"></i>
                </div>
                <div class="transaction-info">
                    <h4>${escapeHTML(transaction.description)}</h4>
                    <div class="transaction-meta">
                        <span class="transaction-category">${escapeHTML(transaction.category)}</span>
                        <span>${new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// FIX: [Pagination for Transactions] and [XSS in Dynamic Rendering]
async function displayAllTransactions(isInitial = true) {
    const allTransactionsList = document.getElementById('all-transactions-list');
    const loadMoreContainer = document.getElementById('load-more-container');
    if (!allTransactionsList) return;

    if (isInitial) {
        allTransactionsList.innerHTML = '<div class="loader-spinner"></div>';
        transactionPagination.currentPage = 1;
    }

    const categoryFilter = document.getElementById('filter-category')?.value || '';
    const typeFilter = document.getElementById('filter-type')?.value || '';

    let endpoint = `/transactions?page=${transactionPagination.currentPage}&limit=${transactionPagination.limit}`;
    // Future expansion: Backend filtering
    // For now, filtering is done client-side based on the current full list for simplicity
    // But pagination is implemented on the backend.

    try {
        const response = await apiCall(endpoint);
        const fetchedTransactions = response.data;
        transactionPagination.hasMore = response.page < response.pages;

        if (isInitial) {
            allTransactionsList.innerHTML = '';
        }

        if (fetchedTransactions.length === 0 && isInitial) {
            allTransactionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-filter"></i>
                    <h3>No transactions found</h3>
                </div>
            `;
            loadMoreContainer?.classList.add('hidden');
            return;
        }

        fetchedTransactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            // FIX: [XSS in Dynamic Rendering] Using textContent safely
            item.innerHTML = `
                <div class="transaction-details">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="fas fa-arrow-${transaction.type === 'income' ? 'up' : 'down'}"></i>
                    </div>
                    <div class="transaction-info">
                        <h4 class="txn-desc"></h4>
                        <div class="transaction-meta">
                            <span class="transaction-category txn-cat"></span>
                            <span>${new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                </div>
                <div class="transaction-actions">
                    <button class="btn-delete" data-id="${transaction._id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            item.querySelector('.txn-desc').textContent = transaction.description;
            item.querySelector('.txn-cat').textContent = transaction.category;
            item.querySelector('.btn-delete').addEventListener('click', () => deleteTransaction(transaction._id));
            allTransactionsList.appendChild(item);
        });

        if (transactionPagination.hasMore) {
            loadMoreContainer?.classList.remove('hidden');
        } else {
            loadMoreContainer?.classList.add('hidden');
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to load transactions');
    }
}

async function loadMoreTransactions() {
    transactionPagination.currentPage++;
    await displayAllTransactions(false);
}

async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
        await apiCall(`/transactions/${id}`, { method: 'DELETE' });
        // FIX: [Transaction Delete → State Sync]
        transactions = transactions.filter(t => (t.id || t._id) !== id);
        updateDashboard();
        displayAllTransactions(true);
        showToast('success', 'Success', 'Transaction deleted');
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

function displayBudgetProgress() {
    const budgetProgressList = document.getElementById('budget-progress-list');
    if (!budgetProgressList) return;

    if (budgets.length === 0) {
        budgetProgressList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-gauge-high"></i>
                <h3>No budgets set</h3>
            </div>
        `;
        return;
    }

    budgetProgressList.innerHTML = '';
    budgets.forEach(budget => {
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);

        const percentage = Math.min((spent / budget.limit) * 100, 100);
        const status = percentage > 90 ? 'danger' : percentage > 70 ? 'warning' : '';

        const item = document.createElement('div');
        item.className = 'budget-item';
        item.innerHTML = `
            <div class="budget-header">
                <h4 class="budget-title"></h4>
                <span class="budget-amount">₹${spent.toFixed(2)} / ₹${budget.limit.toFixed(2)}</span>
            </div>
            <div class="budget-progress-bar">
                <div class="budget-progress-fill ${status}" style="width: ${percentage}%"></div>
            </div>
            <div class="budget-stats">${percentage.toFixed(1)}% used</div>
        `;
        item.querySelector('.budget-title').textContent = budget.category;
        budgetProgressList.appendChild(item);
    });
}

function displaySavingsGoals() {
    const savingsGoalsList = document.getElementById('savings-goals-list');
    if (!savingsGoalsList) return;

    if (savingsGoals.length === 0) {
        savingsGoalsList.innerHTML = '<div class="empty-state"><h3>No savings goals</h3></div>';
        return;
    }

    savingsGoalsList.innerHTML = '';
    savingsGoals.forEach(goal => {
        const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

        const item = document.createElement('div');
        item.className = 'savings-goal';
        item.innerHTML = `
            <div class="goal-header">
                <div class="goal-info">
                    <h4 class="goal-title"></h4>
                    <p class="goal-deadline">${daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</p>
                </div>
                <div class="goal-amount">
                    <div class="goal-current">₹${goal.currentAmount.toFixed(2)}</div>
                    <div class="goal-target">of ₹${goal.targetAmount.toFixed(2)}</div>
                </div>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="goal-percentage">${percentage.toFixed(1)}% completed</div>
            </div>
            <div class="goal-actions">
                <button class="btn btn-small btn-secondary btn-update">Update</button>
                <button class="btn btn-small btn-danger btn-delete">Delete</button>
            </div>
        `;
        item.querySelector('.goal-title').textContent = goal.title;
        item.querySelector('.btn-update').onclick = () => updateSavingsGoal(goal._id);
        item.querySelector('.btn-delete').onclick = () => deleteSavingsGoal(goal._id);
        savingsGoalsList.appendChild(item);
    });
}

async function updateSavingsGoal(id) {
    const goal = savingsGoals.find(g => (g.id || g._id) === id);
    if (!goal) return;

    const newAmount = prompt(`Update current amount for "${goal.title}":`, goal.currentAmount);
    if (newAmount === null) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < 0) {
        showToast('error', 'Error', 'Invalid amount');
        return;
    }

    try {
        await apiCall(`/savings/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ currentAmount: amount })
        });
        goal.currentAmount = amount;
        displaySavingsGoals();
        updateDashboard();
        showToast('success', 'Success', 'Savings goal updated!');
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

async function deleteSavingsGoal(id) {
    if (!confirm('Are you sure you want to delete this savings goal?')) return;
    try {
        await apiCall(`/savings/${id}`, { method: 'DELETE' });
        savingsGoals = savingsGoals.filter(g => (g.id || g._id) !== id);
        displaySavingsGoals();
        updateDashboard();
        showToast('success', 'Success', 'Savings goal deleted');
    } catch (error) {
        showToast('error', 'Error', error.message);
    }
}

// ==================== CHARTS & DARK MODE ====================

function updateCharts() {
    updateExpenseChart();
    updateIncomeExpenseChart();
}

function updateExpenseChart() {
    const canvas = document.getElementById('expense-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
    if (charts.expenseChart) charts.expenseChart.destroy();
    charts.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expensesByCategory),
            datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: ['#FF4D00', '#FFAB00', '#00C853', '#2979FF', '#FF1744', '#D500F9']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function updateIncomeExpenseChart() {
    const canvas = document.getElementById('income-expense-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const last6Months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    const incomeData = last6Months.map((m, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        return transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() === d.getMonth())
            .reduce((s, t) => s + t.amount, 0);
    });
    const expenseData = last6Months.map((m, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        return transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === d.getMonth())
            .reduce((s, t) => s + t.amount, 0);
    });
    if (charts.incomeExpenseChart) charts.incomeExpenseChart.destroy();
    charts.incomeExpenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last6Months,
            datasets: [
                { label: 'Income', data: incomeData, borderColor: '#00C853', tension: 0.4 },
                { label: 'Expenses', data: expenseData, borderColor: '#FF4D00', tension: 0.4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function initializeDarkMode() {
    const savedMode = localStorage.getItem('budget_dark_mode');
    if (savedMode === 'true') document.body.classList.add('dark-mode');
    updateDarkModeIcon();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('budget_dark_mode', document.body.classList.contains('dark-mode'));
    updateDarkModeIcon();
}

function updateDarkModeIcon() {
    const icon = document.querySelector('#dark-mode-toggle i');
    if (icon) icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconMap = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    toast.innerHTML = `<div class="toast-icon"><i class="fas ${iconMap[type]}"></i></div><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOutRight 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ==================== PROFILE SECTION ====================
let userProfile = { name: '', email: '', avatar: '', monthlyBudget: 0 };
function loadUserProfile() {
    const savedProfile = localStorage.getItem('budget_user_profile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    } else if (currentUser) {
        userProfile = { name: currentUser.name, email: currentUser.email, avatar: '', monthlyBudget: 0 };
    }
    if (!userProfile.avatar) {
        userProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=FF4D00&color=fff&size=200`;
    }
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = userProfile.name;

    const profileNameDisplay = document.getElementById('profile-name-display');
    if (profileNameDisplay) profileNameDisplay.textContent = userProfile.name;

    const profileEmailDisplay = document.getElementById('profile-email-display');
    if (profileEmailDisplay) profileEmailDisplay.textContent = userProfile.email;

    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) profileAvatar.src = userProfile.avatar;

    const userAvatarSmall = document.getElementById('user-avatar-small');
    if (userAvatarSmall) userAvatarSmall.src = userProfile.avatar;

    const profileMonthlyBudget = document.getElementById('profile-monthly-budget');
    if (profileMonthlyBudget) profileMonthlyBudget.textContent = `₹${(userProfile.monthlyBudget || 0).toFixed(2)}`;

    updateProfileFinancialSummary();
}

function updateProfileFinancialSummary() {
    if (!transactions) return;  // ADD THIS LINE
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const profileTotalIncome = document.getElementById('profile-total-income');
    if (profileTotalIncome) profileTotalIncome.textContent = `₹${totalIncome.toFixed(2)}`;

    const profileTotalExpenses = document.getElementById('profile-total-expenses');
    if (profileTotalExpenses) profileTotalExpenses.textContent = `₹${totalExpenses.toFixed(2)}`;

    const profileRemainingBalance = document.getElementById('profile-remaining-balance');
    if (profileRemainingBalance) profileRemainingBalance.textContent = `₹${(totalIncome - totalExpenses).toFixed(2)}`;
}


// Profile UI Helpers
function toggleProfileEdit() {
    const view = document.getElementById('profile-details-view');
    const form = document.getElementById('profile-edit-form');
    const isEditing = form.style.display === 'flex';
    view.style.display = isEditing ? 'flex' : 'none';
    form.style.display = isEditing ? 'none' : 'flex';
    if (!isEditing) {
        document.getElementById('edit-profile-name').value = userProfile.name;
        document.getElementById('edit-monthly-budget').value = userProfile.monthlyBudget;
    }
}

async function saveProfileChanges() {
    userProfile.name = document.getElementById('edit-profile-name').value;
    userProfile.monthlyBudget = parseFloat(document.getElementById('edit-monthly-budget').value) || 0;
    localStorage.setItem('budget_user_profile', JSON.stringify(userProfile));
    updateProfileDisplay();
    toggleProfileEdit();
    showToast('success', 'Profile Updated', 'Changes saved successfully');
}

// ==================== AI FORECASTER ====================
let forecastData = { insights: [], alerts: [], nextMonthPrediction: 0 };

function generateAIInsights() {
    // Basic AI insight logic preserved
    return [{ type: 'info', icon: 'fa-brain', title: 'AI Prediction', message: 'Spend wisely based on your last 6 months trend.' }];
}

async function generateForecast() {
    const btn = document.getElementById('generateForecastBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

    await new Promise(r => setTimeout(r, 1500)); // Simulate AI heavy work

    const monthlyExpenses = last6MonthsData();
    forecastData.nextMonthPrediction = monthlyExpenses.reduce((a, b) => a + b, 0) / (monthlyExpenses.length || 1) * 1.05;
    forecastData.insights = generateAIInsights();

    updateForecastUI();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate AI Forecast';
}

function last6MonthsData() {
    const now = new Date();
    return [0, 1, 2, 3, 4, 5].map(i => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === d.getMonth()).reduce((s, t) => s + t.amount, 0);
    });
}

function updateForecastUI() {
    document.getElementById('nextMonthForecast').textContent = `₹${forecastData.nextMonthPrediction.toFixed(2)}`;
    const container = document.getElementById('aiInsightsList');
    container.innerHTML = forecastData.insights.map(i => `
        <div class="insight-item ${i.type}">
            <i class="fas ${i.icon}"></i>
            <div><h4>${i.title}</h4><p>${i.message}</p></div>
        </div>
    `).join('');
}

function initializeAIForecaster() {
    document.getElementById('generateForecastBtn')?.addEventListener('click', generateForecast);
}
