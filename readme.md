# 📱 Digital Wallet API

A secure, modular, and **role-based backend API** for a digital wallet system.  
Supports multiple roles: **Superadmin, Admin, Agent, Merchant, and User** with JWT-based authentication and Google OAuth.

---

## 🚀 Features
- 🔑 **Authentication**: Credentials & Google OAuth  
- 👤 **User Management**: Registration, login, profiles  
- 💳 **Wallet Operations**: Cash-in, cash-out, send money, payments  
- 🛒 **Merchant Support**: Accept payments & view transactions  
- 🏦 **Agent Services**: Handle user cash-in/cash-out  
- 🛡️ **Role-Based Access Control**  
- ⚙️ **Scalable Project Structure**

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, TypeScript  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT, Passport (Google OAuth)  
- **Validation**: Zod/Joi  
- **Security**: Bcrypt password hashing, centralized error handling  

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/wallet-api.git

# Install dependencies
cd wallet-api
npm install

# Setup environment variables
cp .env.example .env

# Run in development
npm run dev

# Build project
npm run build

# Run production
npm start


🔑 Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user/agent/merchant
POST	/api/auth/login	Login with email & password
GET	/api/auth/google	Google OAuth login redirect


Example Request – Register

POST /api/auth/register
{
  "name": "Avik Das",
  "email": "avik@example.com",
  "password": "StrongPass123",
  "phone": "9876543210",
  "role": "user"
}

User Endpoints
Method	Endpoint	Description
GET	/api/user/profile	Get user profile
PUT	/api/user/profile	Update profile
POST	/api/user/send-money	Send money to another user
POST	/api/user/add-money	Add money from bank/card
GET	/api/user/transactions	Transaction history
🏦 Agent Endpoints
Method	Endpoint	Description
POST	/api/agent/cash-in	Cash-in to user wallet
POST	/api/agent/cash-out	Cash-out from user wallet
GET	/api/agent/transactions	Agent transaction logs
🛒 Merchant Endpoints
Method	Endpoint	Description
POST	/api/merchant/payment	Accept payment from user
GET	/api/merchant/transactions	Merchant transaction history
👨‍💼 Admin Endpoints
Method	Endpoint	Description
GET	/api/admin/users	Get all users
PUT	/api/admin/user/:id/block	Block/unblock a user
GET	/api/admin/agents	Get all agents
POST	/api/admin/agent	Create new agent
GET	/api/admin/merchants	Get all merchants
POST	/api/admin/merchant	Create new merchant
🦸 Superadmin Endpoints
Method	Endpoint	Description
GET	/api/superadmin/admins	Get all admins
POST	/api/superadmin/admin	Create new admin
DELETE	/api/superadmin/admin/:id	Remove admin
🔐 Security

All endpoints (except login/register) require JWT authentication

Use Authorization: Bearer <token> header

Role-based authorization middleware ensures proper access

✅ Best Practices Implemented

Centralized error handling (AppError, catchAsync)

Input validation using Zod/Joi

Password hashing with bcrypt

Role-based access control middleware

Scalable modular structure

📜 License

MIT License © 2025 Avik Das

---

Would you like me to also include a **Swagger/OpenAPI section inside this README** (so devs can see interactive docs via `/api/docs`), or keep it as a clean markdown guide only?
