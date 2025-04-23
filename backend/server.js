const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

// Cors configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Vite's default port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://your-production-domain.com",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    // other options...
  }),
);

// Mock database
let users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    password: "$2a$10$eiEu6L0306j1H89V0yY4SeNd5RXRlYEiUBCMPTPTWJ9QbRT5kiu6K", // password123
  },
];

let transactions = [
  {
    id: 1,
    amount: 2500,
    type: "income",
    category: "Salary",
    description: "Monthly salary",
    date: "2025-01-01",
    userId: 1,
  },
  {
    id: 2,
    amount: 500,
    type: "expense",
    category: "Food",
    description: "Grocery shopping",
    date: "2025-01-03",
    userId: 1,
  },
  {
    id: 3,
    amount: 200,
    type: "expense",
    category: "Transport",
    description: "Gas",
    date: "2025-01-05",
    userId: 1,
  },
  {
    id: 4,
    amount: 100,
    type: "expense",
    category: "Entertainment",
    description: "Movie tickets",
    date: "2025-01-10",
    userId: 1,
  },
  {
    id: 5,
    amount: 150,
    type: "expense",
    category: "Shopping",
    description: "Clothes",
    date: "2025-01-15",
    userId: 1,
  },
  {
    id: 6,
    amount: 300,
    type: "income",
    category: "Other Income",
    description: "Freelance work",
    date: "2025-01-20",
    userId: 1,
  },
];

// JWT Secret - in production, use environment variable
const JWT_SECRET = "your-secret-key";

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

// Route to register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    // Create JWT token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1d" });

    // Return user and token
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to login a user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    // Return user and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get current user
app.get("/api/users/me", authenticateToken, (req, res) => {
  const user = users.find((user) => user.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

// Route to get all transactions for current user
app.get("/api/transactions", authenticateToken, (req, res) => {
  const userTransactions = transactions.filter(
    (transaction) => transaction.userId === req.user.id,
  );
  res.json(userTransactions);
});

// Route to add a new transaction
app.post("/api/transactions", authenticateToken, (req, res) => {
  const { amount, type, category, description, date } = req.body;

  const newTransaction = {
    id: transactions.length + 1,
    amount: parseFloat(amount),
    type,
    category,
    description,
    date,
    userId: req.user.id,
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

// Route to update a transaction
app.put("/api/transactions/:id", authenticateToken, (req, res) => {
  const transactionId = parseInt(req.params.id);
  const { amount, type, category, description, date } = req.body;

  // Find transaction index
  const index = transactions.findIndex(
    (transaction) =>
      transaction.id === transactionId && transaction.userId === req.user.id,
  );

  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Update transaction
  const updatedTransaction = {
    ...transactions[index],
    amount:
      amount !== undefined ? parseFloat(amount) : transactions[index].amount,
    type: type || transactions[index].type,
    category: category || transactions[index].category,
    description: description || transactions[index].description,
    date: date || transactions[index].date,
  };

  transactions[index] = updatedTransaction;
  res.json(updatedTransaction);
});

// Route to delete a transaction
app.delete("/api/transactions/:id", authenticateToken, (req, res) => {
  const transactionId = parseInt(req.params.id);

  // Find transaction index
  const index = transactions.findIndex(
    (transaction) =>
      transaction.id === transactionId && transaction.userId === req.user.id,
  );

  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Remove transaction
  transactions.splice(index, 1);
  res.status(204).send();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
