import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (error) {
      setErr("Invalid admin credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100 relative px-4 py-10">

      {/* 🔹 Top-right switch buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold text-sm shadow hover:bg-indigo-700 transition"
        >
          User Login
        </button>

        <button
          onClick={() => navigate("/admin-login")}
          className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition"
        >
          Admin Login
        </button>
      </div>

      {/* 🔹 Main admin login card */}
      <div className="w-full max-w-md mx-auto bg-white/90 border border-indigo-100 rounded-3xl shadow-xl p-8 mt-20">
        <h2 className="text-2xl font-bold text-indigo-800 text-center mb-1 font-sans">
          Admin Login
        </h2>
        <p className="text-sm text-slate-600 text-center mb-6 font-sans">
          Access the admin control panel.
        </p>

        {err && (
          <div className="mb-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 font-sans">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 font-sans">
              Admin Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white
              focus:ring-2 focus:ring-indigo-500 font-sans"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 font-sans">
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm pr-10 bg-white 
                focus:ring-2 focus:ring-indigo-500 font-sans"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-sans"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="w-full bg-indigo-600 text-white rounded-full py-2.5 text-sm font-semibold
            hover:bg-indigo-700 transition shadow disabled:opacity-60 font-sans"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
