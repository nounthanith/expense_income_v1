import React, { useState } from "react";
import Navbar from "../../layouts/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import {
  FiArrowLeft,
  FiCheck,
  FiDollarSign,
  FiTag,
  FiType,
} from "react-icons/fi";
import { FileText } from "lucide-react";

// Predefined icons for categories
const CATEGORY_ICONS = [
  "💰",
  "💵",
  "💳",
  "🏠",
  "🍔",
  "🚗",
  "✈️",
  "🎬",
  "🏥",
  "🎓",
  "🛒",
  "👕",
  "💻",
  "📱",
  "🎁",
  "❤️",
  "🐾",
  "⚽",
  "🎮",
  "📚",
];

function CreateCategory() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "income",
    color: "#4f46e5", // Default indigo color
    icon: "💰",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Category name is required");
      setLoading(false);
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Category name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/categories",
        {
          ...formData,
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/category");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Category Created!
              </h2>
              <p className="text-gray-600 mb-6">
                Your category has been successfully created.
              </p>
              <Link
                to="/category"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors inline-block"
              >
                Back to Categories
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/category"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <FiArrowLeft className="text-lg" />
              Back to Categories
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Create Category
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <FiTag className="text-gray-400" />
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Type Field */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <FiDollarSign className="text-gray-400" />
                  Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Color Field */}
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <FileText className="text-gray-400" />
                  Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    name="color"
                    id="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.color}
                  </span>
                </div>
              </div>

              {/* Icon Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiType className="text-gray-400" />
                  Icon
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 border border-gray-200 rounded-lg">
                  {CATEGORY_ICONS.map((iconOption) => (
                    <button
                      key={iconOption}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: iconOption }))
                      }
                      className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg border-2 transition-all ${
                        formData.icon === iconOption
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {iconOption}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Selected icon: {formData.icon}
                </p>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Preview
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-white rounded-lg text-lg"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formData.name || "Category Name"}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        formData.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formData.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiCheck className="text-lg" />
                    Create Category
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCategory;
