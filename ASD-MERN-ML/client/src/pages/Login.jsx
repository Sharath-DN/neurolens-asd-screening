// client/src/pages/Login.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Login({ ctx }) {
  const { login } = useContext(ctx);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data || {};
      login(token, user?.name || email, remember);
      navigate("/");
    } catch (error) {
      setErr("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100 flex items-center justify-center px-4 py-10 relative">

      {/* ▬▬▬ TOP-RIGHT BUTTONS ▬▬▬ */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700"
        >
          User Login
        </button>

        <button
          onClick={() => navigate("/admin-login")}
          className="px-4 py-2 text-xs sm:text-sm border border-indigo-600 text-indigo-700 rounded-full shadow hover:bg-indigo-100"
        >
          Admin Login
        </button>
      </div>
      {/* ▬▬▬ END BUTTONS ▬▬▬ */}

      <div className="w-full max-w-md bg-white/90 border border-indigo-100 rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-indigo-800 text-center mb-1">User Login</h2>
        <p className="text-sm text-slate-600 text-center mb-6">Sign in to continue.</p>

        {err && (
          <div className="mb-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white
                           focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm pr-10 bg-white 
                             focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center text-xs text-slate-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2"
            />
            Remember me
          </div>

          <button
            className="w-full bg-indigo-600 text-white rounded-full py-2.5 text-sm font-semibold
                       hover:bg-indigo-700 transition shadow disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <p className="mt-4 text-xs text-center text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
