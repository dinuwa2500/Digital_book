import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1917] p-4">
      <div className="w-full max-w-md bg-stone-50 rounded-lg shadow-2xl p-10 border-l-8 border-stone-800">
        <h2 className="text-4xl font-serif text-stone-800 mb-2">Welcome Back</h2>
        <p className="text-stone-500 font-serif italic mb-8">Sign in to your digital library</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-serif text-stone-600 mb-2 italic">
              Electronic Mail
            </label>
            <input
              type="email"
              required
              placeholder="leo@renaissance.com"
              className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-stone-500 focus:ring-0 outline-none transition-all font-serif"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-serif text-stone-600 mb-2 italic">
              Pass-phrase
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-stone-500 focus:ring-0 outline-none transition-all font-serif"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stone-800 text-stone-100 py-4 rounded-sm font-serif text-lg hover:bg-stone-700 transition-all shadow-lg active:translate-y-0.5"
          >
            Enter Archive
          </button>
        </form>

        <p className="mt-8 text-center text-stone-500 font-serif">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-stone-800 font-bold underline underline-offset-4 decoration-stone-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
