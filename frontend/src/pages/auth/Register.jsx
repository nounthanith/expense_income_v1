import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-transform hover:scale-105">
        <h2 className="text-center text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-500">
            Sign in
          </Link>
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;