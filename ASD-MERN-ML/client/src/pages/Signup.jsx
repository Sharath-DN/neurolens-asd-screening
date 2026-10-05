// client/src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Signup({ ctx }) {
  useContext(ctx);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password must contain 1 uppercase, 1 special character, and be >= 8 characters
  const strongPassword = (pwd) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) && // at least one capital letter
      /[!@#$%^&*(),.?":{}|<>]/.test(pwd) // at least one special letter
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name || !email || !password || !confirm) {
      setErr("Please fill in all the fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }

    if (!strongPassword(password)) {
      setErr(
        "Password must be at least 8 characters long and include one uppercase letter and one special character."
      );
      return;
    }

    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/auth/signup`, {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      const msg =
        error?.response?.data?.message ||
        "Unable to create account right now. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-indigo-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white/90 rounded-3xl shadow-xl border border-indigo-100 p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign up to start using Neurolens for early autism screening and
            support.
          </p>
        </div>

        {err && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Strong password info */}
            <p className="mt-1 text-xs text-slate-500">
              Password must be at least <strong>8 characters</strong> and include{" "}
              <strong>one uppercase letter</strong> and{" "}
              <strong>one special character</strong>.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex justify-center items-center rounded-full bg-indigo-600 text-white py-2.5 text-sm font-medium shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs sm:text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
