# Personal Budgeting and Expense Forecaster

## 📊 Overview

**Personal Budgeting and Expense Forecaster** is an intelligent budget management and financial forecasting platform that helps you track expenses, set budgets, and predict your financial future.

### Key Features
- ✅ **Dashboard** - Financial overview with income, expenses, balance, and savings
- ✅ **Profile Section** - Manage account details and view financial summary
- ✅ **Income & Expense Tracking** - Record all your financial transactions
- ✅ **Budget Management** - Set category-wise spending limits
- ✅ **Savings Goals** - Track progress toward financial targets
- ✅ **Data Visualization** - Interactive charts and graphs
- ✅ **Dark/Light Theme** - Toggle between themes
- ✅ **Offline Mode** - Works with local storage when API is unavailable

---

## 🚀 Quick Start

### Option 1: Direct Browser
1. Navigate to `frontend/` folder
2. Open `index.html` in your browser
3. Use demo credentials:
   - Email: demo@budget.com
   - Password: demo123

### Option 2: VS Code Live Server
1. Open project in VS Code
2. Install "Live Server" extension
3. Right-click `frontend/index.html`
4. Select "Open with Live Server"

### Option 3: Local Server
```bash
cd frontend
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📁 Project Structure

```
Personal-Budgeting-Forecaster/
│
├── frontend/
│   ├── index.html          # Main HTML (renamed from Expensly)
│   ├── style.css           # Complete CSS with profile styles
│   └── app.js              # JavaScript with profile functionality
│
├── backend/
│   ├── server.js           # Express server
│   ├── models/             # MongoDB models
│   └── routes/             # API routes
│
├── README.md               # This file
└── package.json            # Dependencies
```

---

## 🎨 New Profile Section

### Features Included:

#### 1. Personal Information Card
- Display name, email, and join date
- Profile photo with upload capability
- Edit profile functionality
- Update monthly budget target

#### 2. Financial Summary Card
- Real-time income total
- Real-time expense total
- Remaining balance calculation
- Monthly budget display
- Budget utilization progress bar with color-coded warnings

#### 3. Quick Actions Card
- One-click navigation to:
  - Add Income
  - Add Expense
  - Set Budget
  - Create Savings Goal

#### 4. Account Actions Card
- Export all data as JSON
- Change password (coming soon)
- Logout functionality

---

## 🔄 What Was Changed

### Files Modified:

#### 1. **index.html** (Renamed from Expensly)
- **Changed:** All "Expensly" references to "Personal Budgeting and Expense Forecaster"
- **Changed:** Logo icon from wallet to chart-line
- **Changed:** Hero title and subtitle
- **Changed:** Demo email from demo@expensly.com to demo@budget.com
- **Added:** Profile section with complete UI
- **Added:** User avatar in header
- **Added:** Logout button in sidebar
- **Added:** Profile navigation item

#### 2. **style.css** (Enhanced)
- **Kept:** All original modern n8n-inspired design
- **Kept:** Dark/orange and light themes
- **Added:** 500+ lines of profile-specific styles:
  - Profile grid layout
  - Profile cards
  - Avatar upload section
  - Financial summary styles
  - Quick actions grid
  - Account actions list
  - Budget utilization progress bar
  - Responsive design for mobile

#### 3. **app.js** (Enhanced)
- **Changed:** All localStorage keys from 'expensly_' to 'budget_'
- **Changed:** API references and variable names
- **Added:** Profile data management functions
- **Added:** Profile display and update functions
- **Added:** Avatar upload functionality
- **Added:** Budget utilization calculations
- **Added:** Data export functionality
- **Added:** Profile event listeners
- **Modified:** `showMainApp()` to initialize profile
- **Modified:** `updateDashboard()` to sync with profile

### Files Created:
- None (all existing files were enhanced)

---

## 💾 Data Structure

### User Profile Object
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  avatar: "base64_or_url",
  monthlyBudget: 50000,
  joinedDate: "2024-01-15T00:00:00.000Z"
}
```

### Storage Keys
- `budget_token` - Authentication token
- `budget_current_user` - Current user data
- `budget_user_profile` - Extended profile data
- `budget_users` - All users (offline mode)
- `budget_transactions` - Transaction history
- `budget_budgets` - Budget limits
- `budget_savings` - Savings goals
- `budget_dark_mode` - Theme preference
- `budget_monthly_target` - Monthly budget target

---

## 🔗 Profile-Data Integration

### How Profile Connects with Existing Features:

#### 1. **Income/Expense Sync**
- Profile financial summary updates in real-time when:
  - New income is added
  - New expense is recorded
  - Transaction is deleted
- Uses same `transactions` array as dashboard

#### 2. **Budget Integration**
- Monthly budget set in profile affects:
  - Budget utilization progress bar
  - Warning colors (yellow >70%, red >90%)
  - Dashboard calculations
- Stored in: `userProfile.monthlyBudget` and `budget_monthly_target`

#### 3. **User Data Sync**
- Profile name updates reflect in:
  - Header user name
  - Avatar initials (if no photo)
  - Local storage `budget_current_user`
- Profile changes persist across sessions

#### 4. **Quick Actions**
- Buttons navigate to existing sections:
  - `showSection('income')`
  - `showSection('expenses')`
  - `showSection('budget')`
  - `showSection('savings')`
- Maintains context and data consistency

---

## 🎯 Key Functions Added

### Profile Management:
```javascript
loadUserProfile()              // Load profile from storage
saveUserProfile()              // Save profile to storage
updateProfileDisplay()         // Update UI with profile data
updateProfileFinancialSummary() // Calculate and display financials
updateBudgetUtilization()      // Update progress bar
```

### Profile Actions:
```javascript
toggleProfileEdit()            // Switch between view/edit mode
saveProfileChanges()           // Save edited profile
handleAvatarUpload()           // Process profile photo
exportUserData()               // Export all data as JSON
changePassword()               // Password change (placeholder)
```

### Event Handlers:
```javascript
setupProfileEventListeners()   // Attach all profile events
```

---

## 📱 Responsive Design

### Desktop (1024px+)
- 2-column profile grid
- Full sidebar visible
- Large stat cards

### Tablet (768px-1023px)
- 1-column profile grid
- Collapsible sidebar
- Medium stat cards

### Mobile (<768px)
- Single column layout
- Hamburger menu
- Stacked quick actions
- Smaller avatars

---

## 🎨 Theme Support

Both dark and light themes fully support the profile section:

### Dark Theme
- Background: #1A1A1A
- Surface: #242424
- Cards: Elevated with shadows
- Text: #E5E7EB
- Accents: Orange (#FF6D5A)

### Light Theme
- Background: #FAFAFA
- Surface: #FFFFFF
- Cards: Clean with borders
- Text: #1F2937
- Accents: Orange (#FF6D5A)

---

## ⚙️ Technical Details

### Dependencies
No new dependencies added. Uses existing:
- Font Awesome 6.5.1 (icons)
- Chart.js (graphs)
- Vanilla JavaScript
- CSS Grid & Flexbox

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Sizes
- index.html: ~26KB (+8KB for profile)
- style.css: ~32KB (+12KB for profile)
- app.js: ~38KB (+6KB for profile)

---

## 🔒 Data Privacy

- All data stored locally in browser
- Profile photos converted to base64
- No external tracking
- Export data anytime
- Clear data by logging out

---

## 🚦 Feature Status

### ✅ Completed
- Profile display
- Profile editing
- Avatar upload
- Financial summary
- Budget utilization
- Quick actions
- Data export
- Theme integration
- Responsive design

### 🔄 Coming Soon
- Password change
- Email notifications
- Two-factor authentication
- Cloud sync
- Multi-currency support

---

## 🐛 Troubleshooting

### Profile Not Loading
1. Clear browser cache
2. Check localStorage permissions
3. Ensure JavaScript is enabled

### Avatar Not Uploading
1. Check file size (<2MB)
2. Verify image format (PNG, JPG, GIF)
3. Try different browser

### Budget Not Updating
1. Refresh the page
2. Check console for errors
3. Re-enter budget amount

---

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Verify all files are present
3. Ensure Font Awesome CDN is accessible

---

## 🎉 Credits

**Original Project:** Expensly - Smart Budget Tracker  
**Renamed To:** Personal Budgeting and Expense Forecaster  
**Profile Section:** Added in 2024  
**Design:** Modern, n8n-inspired UI  
**Icons:** Font Awesome 6.5.1  

---

## 📄 License

MIT License - Free to use and modify

---

## 🚀 Future Enhancements

- AI-powered expense forecasting
- Receipt scanning with OCR
- Bank account integration
- Expense categories customization
- Recurring transactions
- Bill reminders
- Financial reports (PDF)
- Mobile app version

---

**Enjoy managing your finances with Personal Budgeting and Expense Forecaster!** 💰📊
