import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HomePage } from "./pages/HomePage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import axios from "axios";

// Configure axios
// In production, this would point to your actual backend
// For development, you can use a mock API or a local server
axios.defaults.baseURL = "http://localhost:8000"; // Replace with your API URL
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add token to requests if it exists
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TransactionProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
