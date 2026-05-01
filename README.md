# Personal Budgeting and Expense Forecaster (Expensly AI-Enhanced)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-green.svg)
![Status: Deployed](https://img.shields.io/badge/Status-Deployed-success.svg)

## 📊 Overview

**Personal Budgeting and Expense Forecaster** is an intelligent, full-stack budget management and financial forecasting platform. It helps you track expenses, set budgets, and predict your financial future using a modern web interface and a robust backend.

### 🌟 Live Demo
**Access the deployed application here:** [https://expensly-ai-enhanced.onrender.com](https://expensly-ai-enhanced.onrender.com)

---

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based login and registration with strong password validation and bcrypt hashing.
- 📈 **Dashboard** - Comprehensive financial overview displaying income, expenses, balance, and savings.
- 👤 **Profile Management** - Manage account details, update monthly budget targets, and view personalized financial summaries.
- 💸 **Income & Expense Tracking** - Record, categorize, and track all your financial transactions.
- 🎯 **Budget Management** - Set category-wise spending limits with visual utilization progress.
- 🏦 **Savings Goals** - Create and track progress toward specific financial targets.
- 📊 **Data Visualization** - Interactive charts and graphs powered by Chart.js.
- 🌗 **Dark/Light Theme** - Seamless toggle between themes for a comfortable viewing experience.

---

## 🛠️ Technology Stack

This application is built using a custom **MERN-like Stack** (MongoDB, Express, Vanilla JS, Node.js):

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3, Font Awesome (Icons), Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Deployment:** Render (Hosting)

---

## 📁 Project Structure

```text
BudgetWise-AI-Enhanced/
│
├── frontend/                 # Client-side files
│   ├── index.html            # Main SPA HTML
│   ├── style.css             # UI Styles and Theming
│   └── app.js                # Frontend Application Logic
│
├── backend/                  # Server-side logic
│   ├── server.js             # Express application entry point
│   ├── middleware/           # Custom middleware (Auth, Error Handling)
│   ├── models/               # Mongoose schemas (User, Transaction, Budget, SavingsGoal)
│   └── routes/               # API endpoints
│
├── package.json              # Project dependencies & scripts
├── .env.example              # Example environment variables
└── README.md                 # Project documentation
```

---

## 🚀 Local Setup & Installation

To run this project locally on your machine, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 2. Clone and Install
```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd BudgetWise-AI-Enhanced

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following configurations:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
```
*(You can refer to `.env.example` for the template).*

### 4. Run the Application
```bash
# Start in development mode (using nodemon)
npm run dev

# OR start in production mode
npm start
```
The application will be accessible at: `http://localhost:5000`

---

## 🌐 API Endpoints

The backend exposes a RESTful API. Below are the core route categories:

- **Authentication:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Transactions:** `/api/transactions` (GET, POST, DELETE)
- **Budgets:** `/api/budgets` (GET, POST, PUT, DELETE)
- **Savings:** `/api/savings` (GET, POST, PUT, DELETE)

*Note: All endpoints (except login/register) require a valid JWT token passed in the `Authorization: Bearer <token>` header.*

---

## 🚢 Deployment Details

The project is configured for cloud deployment and is currently hosted on **Render**.

### Deployment Architecture
- **Single Node Service:** The Express backend serves the API routes under `/api/*` and acts as a static file server for the `frontend/` directory.
- **SPA Fallback:** All non-API requests are routed to `index.html` to support frontend routing (Single Page Application behavior).
- **CORS Configured:** Secure CORS rules are set up to allow traffic from designated origins.
- **Database:** Hosted securely on MongoDB Atlas.

### How to deploy your own instance on Render:
1. Push this repository to GitHub.
2. Log into [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`) in the Render dashboard.
6. Click **Deploy**.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the [MIT License](LICENSE).


