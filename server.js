// src/server.js
import express from "express";
import sql from "mssql";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConfig from "./db.js";

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON bodies

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields");

  try {
    const pool = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .query("INSERT INTO Users (Username, PasswordHash) VALUES (@Username, @PasswordHash)");

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error");
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields");

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (result.recordset.length === 0) return res.status(400).send("Invalid credentials");

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ id: user.Id, username: user.Username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// PROTECTED ROUTE EXAMPLE
app.get("/api/profile", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("No token provided");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Protected data", user: decoded });
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Auth API running on http://localhost:${PORT}`));
