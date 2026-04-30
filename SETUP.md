# 🚀 Setup Guide - Personal Budgeting and Expense Forecaster

## Quick Start (No Installation Required!)

The easiest way to use the application is to simply open the HTML file:

1. Navigate to `frontend/` folder
2. Double-click `index.html`
3. Use demo credentials:
   - **Email:** demo@budget.com
   - **Password:** demo123

That's it! The app works entirely in your browser with no server required.

---

## 📋 Table of Contents

1. [Frontend Only Setup](#frontend-only-setup)
2. [Full Stack Setup (Optional)](#full-stack-setup)
3. [Features Overview](#features-overview)
4. [Using the Profile Section](#using-the-profile-section)
5. [Data Management](#data-management)
6. [Troubleshooting](#troubleshooting)

---

## 🎨 Frontend Only Setup

### Option 1: Direct Browser (Easiest)

```bash
# Navigate to frontend folder
cd frontend

# Open index.html in your default browser
# Windows:
start index.html

# macOS:
open index.html

# Linux:
xdg-open index.html
```

### Option 2: VS Code Live Server (Recommended)

1. Open project in VS Code
2. Install "Live Server" extension
3. Right-click `frontend/index.html`
4. Select "Open with Live Server"
5. Browser opens automatically at `http://127.0.0.1:5500`

### Option 3: Python HTTP Server

```bash
cd frontend
python -m http.server 8000
# Open http://localhost:8000 in browser
```

### Option 4: Node HTTP Server

```bash
cd frontend
npx http-server -p 8000
# Open http://localhost:8000 in browser
```

---

## 🔧 Full Stack Setup (Optional)

If you want to run the backend API:

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB (optional, uses remote database by default)

### Installation Steps

```bash
# 1. Navigate to project root
cd Personal-Budgeting-Forecaster

# 2. Install dependencies
npm install

# 3. Start the backend server
npm start
# or for development with auto-restart:
npm run dev

# 4. Backend runs on http://localhost:5000
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Note:** The app is pre-configured to use a remote MongoDB database, so this is optional.

---

## ✨ Features Overview

### 1. Dashboard
- View financial overview
- Income, Expenses, Balance, Savings cards
- Interactive charts (pie chart and line chart)
- Recent transactions list

### 2. **Profile Section (NEW!)**
- Personal information display
- Profile photo upload
- Financial summary
- Monthly budget tracking
- Budget utilization progress bar
- Quick action buttons
- Data export functionality

### 3. Income Management
- Add income transactions
- Categorize income sources
- Track by date

### 4. Expense Management
- Add expense transactions
- Categorize expenses
- Track spending patterns

### 5. Transactions
- View all transactions
- Filter by category and type
- Delete transactions
- Sort by date

### 6. Budget Management
- Set category-wise budgets
- Track spending against limits
- Visual progress indicators
- Warning alerts (>70% and >90%)

### 7. Savings Goals
- Create savings goals
- Track progress
- Update current amounts
- Deadline monitoring

### 8. Themes
- Light theme
- Dark theme (orange accents)
- Toggle in header
- Preference persists

---

## 👤 Using the Profile Section

### Accessing Profile

**Method 1:** Click on your avatar/name in the header
**Method 2:** Click "Profile" in the sidebar navigation

### Profile Features

#### 1. Personal Information Card

**View Mode:**
- Displays your name, email, and join date
- Shows your profile photo

**Edit Mode:**
```
1. Click "Edit Profile" button
2. Update your name
3. Set monthly budget
4. Click "Save Changes"
```

**Upload Photo:**
```
1. Click "Edit Profile"
2. Click camera icon on avatar
3. Select image file (max 2MB)
4. Photo updates automatically
```

#### 2. Financial Summary Card

**Displays:**
- Total Income (this month)
- Total Expenses (this month)
- Remaining Balance
- Monthly Budget

**Budget Utilization:**
- Green bar: <70% of budget used
- Yellow bar: 70-90% of budget used
- Red bar: >90% of budget used
- Warning messages when approaching limit

#### 3. Quick Actions Card

**One-Click Navigation:**
- Add Income → Income form
- Add Expense → Expense form
- Set Budget → Budget management
- Savings Goal → Savings goals

#### 4. Account Actions Card

**Available Actions:**
- **Export Data:** Downloads all your data as JSON
- **Change Password:** Coming soon feature
- **Logout:** Sign out of your account

---

## 💾 Data Management

### Local Storage (Default Mode)

All data is stored in your browser:

```javascript
// Storage keys used:
budget_token              // Authentication token
budget_current_user       // User account data
budget_user_profile       // Extended profile info
budget_transactions       // All transactions
budget_budgets           // Budget limits
budget_savings           // Savings goals
budget_dark_mode         // Theme preference
budget_monthly_target    // Monthly budget amount
```

### Exporting Your Data

```
1. Go to Profile section
2. Scroll to "Account Actions"
3. Click "Export Data"
4. JSON file downloads automatically
5. File named: budget-export-YYYY-MM-DD.json
```

### Export File Contents

```json
{
  "profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "base64_string_or_url",
    "monthlyBudget": 50000,
    "joinedDate": "2024-01-15T00:00:00.000Z"
  },
  "transactions": [ /* all transactions */ ],
  "budgets": [ /* all budgets */ ],
  "savingsGoals": [ /* all savings goals */ ],
  "exportDate": "2024-02-13T10:30:00.000Z"
}
```

### Importing Data

Currently, there's no import feature. To transfer data:

```
1. Export from old device
2. Open exported JSON file
3. Manually add key transactions on new device
```

**Future Update:** Import functionality coming soon!

---

## 🎯 Setting Up Your Profile

### First-Time Setup

**Step 1: Sign Up**
```
1. Open the app
2. Click "Create account"
3. Enter your name, email, password
4. Click "Create Account"
```

**Step 2: Complete Profile**
```
1. Navigate to Profile section
2. Click "Edit Profile"
3. Update your name if needed
4. Set your monthly budget (e.g., ₹50,000)
5. Upload a profile photo (optional)
6. Click "Save Changes"
```

**Step 3: Start Tracking**
```
1. Use Quick Actions to add first transaction
2. Set up budgets for categories
3. Create savings goals
4. Monitor your progress on Dashboard
```

---

## 🔐 Demo Account

For testing purposes:

```
Email: demo@budget.com
Password: demo123
```

**Note:** Demo data resets on browser refresh.

---

## 📱 Mobile Access

The app is fully responsive and works on:

- 📱 Smartphones (iOS & Android)
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

**Recommended Mobile Browsers:**
- Chrome (Android)
- Safari (iOS)
- Firefox
- Edge

---

## 🐛 Troubleshooting

### Profile Not Loading

**Issue:** Profile section is blank

**Solutions:**
```
1. Hard refresh: Ctrl + Shift + R (Windows/Linux) or Cmd + Shift + R (Mac)
2. Clear browser cache
3. Check browser console (F12) for errors
4. Verify localStorage is enabled
5. Try incognito/private mode
```

### Avatar Not Uploading

**Issue:** Photo doesn't change

**Solutions:**
```
1. Check file size (must be <2MB)
2. Use supported formats: PNG, JPG, GIF, WebP
3. Try a different browser
4. Clear browser cache
5. Use a smaller image
```

### Budget Not Updating

**Issue:** Budget utilization shows 0%

**Solutions:**
```
1. Set monthly budget in Profile > Edit Profile
2. Add some expense transactions
3. Refresh the page
4. Check Profile > Financial Summary
5. Verify transactions are categorized correctly
```

### Data Not Persisting

**Issue:** Data disappears after refresh

**Solutions:**
```
1. Check if localStorage is enabled
2. Not using incognito/private mode
3. Browser has sufficient storage space
4. Check browser console for quota errors
5. Export data regularly as backup
```

### Charts Not Showing

**Issue:** Blank space where charts should be

**Solutions:**
```
1. Ensure internet connection (Chart.js loads from CDN)
2. Check browser console for errors
3. Try different browser
4. Disable ad blockers
5. Check firewall settings
```

### Icons Missing

**Issue:** Boxes or text instead of icons

**Solutions:**
```
1. Check internet connection (Font Awesome CDN)
2. Clear browser cache
3. Check if CDN is blocked
4. Try different browser
5. Wait for CDN to respond
```

---

## 🔧 Advanced Configuration

### Changing Theme Colors

Edit `style.css` and modify CSS variables:

```css
:root {
  --color-primary: #FF6D5A;      /* Main accent color */
  --color-primary-dark: #E85A47;  /* Darker shade */
  --color-primary-light: #FF8B7B; /* Lighter shade */
}
```

### Changing Default Avatar

Edit `app.js` and modify the default avatar URL:

```javascript
// In loadUserProfile() function
userProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=YOUR_COLOR&color=YOUR_TEXT_COLOR&size=200`;
```

### Customizing Categories

Edit `index.html` and add/remove options in category dropdowns:

```html
<!-- Expense categories -->
<select class="form-input" id="expense-category">
    <option value="">Select Category</option>
    <option value="Food">Food & Dining</option>
    <!-- Add more categories here -->
</select>
```

---

## 📊 Understanding the Numbers

### Financial Summary Logic

```javascript
Total Income = Sum of all income transactions
Total Expenses = Sum of all expense transactions
Remaining Balance = Total Income - Total Expenses
Budget Utilization % = (Total Expenses / Monthly Budget) × 100
```

### Budget Warnings

- **Green:** 0-69% of budget used → On track
- **Yellow:** 70-89% of budget used → Approaching limit
- **Red:** 90-100% of budget used → Near or over limit
- **Red Alert:** 100%+ → Over budget!

### Savings Goal Progress

```javascript
Progress % = (Current Amount / Target Amount) × 100
Days Left = Target Date - Today
```

---

## 🚀 Performance Tips

### For Best Performance:

1. **Clear old data periodically** - Export and delete old transactions
2. **Optimize avatar** - Use compressed images under 500KB
3. **Limit transactions** - Archive transactions older than 6 months
4. **Regular exports** - Backup data monthly
5. **Update browser** - Use latest version for best performance

### Storage Limits:

```
localStorage capacity: ~5-10MB per domain
Recommended usage: Keep under 2MB
Monitor in browser console: 
  - localStorage.length
  - JSON.stringify(localStorage).length
```

---

## 📞 Support & Help

### Getting Help:

1. Check this guide first
2. Review CHANGES.md for technical details
3. Check browser console for errors
4. Try different browser
5. Export data before troubleshooting

### Browser Console:

```
Open with: F12 or Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
Check:
  - Console tab for errors
  - Application > Local Storage for data
  - Network tab for API calls
```

---

## 🎉 You're Ready!

Your Personal Budgeting and Expense Forecaster is now set up and ready to use!

**Next Steps:**
1. ✅ Complete your profile
2. ✅ Set monthly budget
3. ✅ Add your first transaction
4. ✅ Create budget limits
5. ✅ Set savings goals
6. ✅ Monitor your progress

**Happy Budgeting!** 💰📊

---

**Last Updated:** February 2024  
**Version:** 2.0 (with Profile Section)
