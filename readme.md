# 💳 Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system.  
Supports multiple roles with **JWT-based authentication** and **Google OAuth**.

---

## 🚀 Features

- 🔑 Authentication: Email/Password & Google OAuth  
- 👤 User wallet management (send money, add money, transaction history)  
- 🏦 Agent services (cash-in, cash-out)  
- 🛒 Merchant payments (accept payments, view transactions)  
- 👨‍💼 Admin & Superadmin panels for user/agent/merchant management  
- 🔐 Secure with **JWT authentication** & **role-based access control**  

---

## 🔑 Authentication Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/api/auth/register`  | Register new **user/agent/merchant** |
| POST   | `/api/auth/login`     | Login with email & password          |
| GET    | `/api/auth/google`    | Google OAuth login redirect          |

### Example – Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Avik Das",
  "email": "avik@example.com",
  "password": "StrongPass123",
  "phone": "9876543210",
  "role": "user"   // superadmin, admin, agent, merchant, user
}
```

### Example – Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "avik@example.com",
  "password": "StrongPass123"
}

Example Response – Success
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt_token>",
    "user": {
      "id": "65123abc456def789ghi",
      "name": "Avik Das",
      "email": "avik@example.com",
      "role": "user"
    }
  }
}

Example Response – Error
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 👤 User Endpoints 

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| GET    | `/api/user/profile`      | Get user profile           |
| GET    | `/api/user/wallet`       | Get wallet balance         |
| POST   | `/api/user/send`         | Send money to another user |
| POST   | `/api/user/add-money`    | Add money to wallet        |
| GET    | `/api/user/transactions` | Transaction history        |


## Example – Send Money
```
POST /api/user/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "65123abc456def789ghi",
  "amount": 500
}


Response

{
  "success": true,
  "message": "Money sent successfully",
  "transactionId": "TXN123456789"
}
```

### 🏦 Agent Endpoints


| Method | Endpoint                  | Description       |
|--------|---------------------------|-------------------|
| POST   | `/api/agent/cash-in`      | Cash-in for user  |
| POST   | `/api/agent/cash-out`     | Cash-out for user |
| GET    | `/api/agent/transactions` | Agent transactions|


### Example – Cash In
```
POST /api/agent/cash-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "65123abc456def789ghi",
  "amount": 2000
}


Response

{
  "success": true,
  "message": "Cash-in successful",
  "transactionId": "AGT987654321"
}
```

### 🛒 Merchant Endpoints

| Method | Endpoint                     | Description             |
|--------|------------------------------|-------------------------|
| POST   | `/api/merchant/accept`       | Accept customer payment |
| GET    | `/api/merchant/transactions` | Merchant transactions   |


### Example – Accept Payment
```
POST /api/merchant/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "65123abc456def789ghi",
  "amount": 1200,
  "orderId": "ORD-90921"
}


Response

{
  "success": true,
  "message": "Payment received successfully",
  "transactionId": "MER5566778899"
}
```

### 👨‍💼 Admin Endpoints

| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| GET    | `/api/admin/users`      | Manage all users     |
| GET    | `/api/admin/agents`     | Manage all agents    |
| GET    | `/api/admin/merchants`  | Manage all merchants |

### 🛡 Superadmin Endpoints

| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/api/superadmin/admins` | Manage all admins              |
| GET    | `/api/superadmin/system` | View system-level configurations|


## 🔐 Security

- 🔑 All endpoints are secured with **JWT tokens**  
- 👮 Role-based access control ensures only authorized roles can access their respective APIs  
- 🔒 Passwords stored with **bcrypt hashing**  
- 🛡 Sensitive data protected with **environment variables**  

---

## 🛠 Tech Stack

- ⚡ **Node.js + Express** – Backend framework  
- 🗄 **MongoDB + Mongoose** – Database  
- 🔐 **JWT & Passport.js** – Authentication  
- 🌐 **Google OAuth 2.0** – Social login  
- 📘 **TypeScript** – Type safety  

