// client/src/App.jsx
import React, { createContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Questionnaire from "./pages/Questionnaire";
import Result from "./pages/Result";
import Support from "./pages/Support";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AboutUs from "./pages/AboutUs";

// Auth context for regular users
export const AuthContext = createContext();

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token") || sessionStorage.getItem("token");
    const u = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (t) setToken(t);
    if (u) setUser(u);
  }, []);

  const login = (tk, usr, remember) => {
    setToken(tk);
    setUser(usr);
    if (remember) {
      localStorage.setItem("token", tk);
      localStorage.setItem("user", usr);
    } else {
      sessionStorage.setItem("token", tk);
      sessionStorage.setItem("user", usr);
    }
  };

  const logout = () => {
    setToken(null);
    setUser("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Minimal nav for login/signup/admin-login (logo only, no links)
  const minimalNav =
    !token &&
    (location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/admin-login");

  // 🔹 Do NOT hide navbar completely anymore (also show on /admin-login)
  const hideNavCompletely = false;

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {/* NAVBAR */}
      {!hideNavCompletely && (
        <nav className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-20 border-b border-indigo-50">
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                N
              </div>
              <h1 className="text-xl font-bold text-indigo-700 tracking-tight">
                Neurolens
              </h1>
            </div>

            {!minimalNav && (
              <div className="flex gap-6 items-center text-sm font-medium">
                <Link
                  className="hover:text-indigo-600 text-slate-700 transition-colors"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="hover:text-indigo-600 text-slate-700 transition-colors"
                  to="/questionnaire"
                >
                  Questionnaire
                </Link>
                <Link
                  className="hover:text-indigo-600 text-slate-700 transition-colors"
                  to="/support"
                >
                  Get Support
                </Link>
                <Link
                  className="hover:text-indigo-600 text-slate-700 transition-colors"
                  to="/about"
                >
                  About Us
                </Link>

                {token && (
                  <button
                    onClick={logout}
                    className="bg-rose-500 text-white px-4 py-1.5 rounded-full hover:bg-rose-600 shadow-sm transition-all text-xs"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      )}

      <Routes>
        {/* About page */}
        <Route path="/about" element={<AboutUs />} />

        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Support is public */}
        <Route path="/support" element={<Support />} />

        {!token && (
          <>
            <Route path="/login" element={<Login ctx={AuthContext} />} />
            <Route path="/signup" element={<Signup ctx={AuthContext} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </>
        )}

        {token && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/result" element={<Result />} />
          </>
        )}

        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
