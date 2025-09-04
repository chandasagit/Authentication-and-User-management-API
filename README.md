# Authentication-and-User-management-API

A secure **Node.js + Express Authentication API** using **JWT (JSON Web Tokens)** and **bcrypt** for password hashing.  
Database powered by **MongoDB + Mongoose**.

This API provides user authentication, authorization, and role-based access control — the building blocks of modern web applications.

##  Features
- User **Sign Up** with hashed password
- User **Login** with JWT authentication
- **Protected routes** accessible only with valid token
- **Role-based access control** (Admin/User)
- Token-based session management

## 📂 Project Structure
<pre>
auth-api/
│── src/
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js        # User schema/model
│   ├── routes/
│   │   └── authRoutes.js
│   ├── server.js          # Entry point
│
│── .env                   # Secrets (DB, JWT secret)
│── package.json
│── README.md
</pre>

# Install dependencies:
<pre>
  npm install
</pre>

# Create a .env file in the root:
<pre>
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/authdb
JWT_SECRET=supersecretkey
</pre>

# Start server:
<pre>
  npm run dev
</pre>

# Example Usage
# Signup
<pre>
curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"username":"manoj","email":"manoj@example.com","password":"mypassword"}'
</pre>

# Login
<pre>
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"manoj@example.com","password":"mypassword"}'
</pre>

# Response
<pre>
{
  "token": "your-jwt-token"
}
</pre>

# Get Profile
<pre>
curl -X GET http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer your-jwt-token"
</pre>

# Tech Stack
- Node.js + Express (server & routes)
- MongoDB + Mongoose (database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT) (authentication)
- dotenv (environment config)

# Future Improvements
- Password reset (via email OTP)
- Refresh tokens
- Google/Facebook OAuth login
- Account verification
