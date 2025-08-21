import React, { useState, useEffect } from "react";
import Navbar from "../../layouts/Navbar";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../utils/api";

function Category() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // string id
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token || !userId) {
        setError("Please log in to view your categories");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter categories by logged-in user safely
        const userCategories = response.data.data.filter(
          (category) => category.userId?._id === userId
        );

        setCategories(userCategories);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, userId]);

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <>
      <Navbar />
      <div className="absolute top-24 w-full">
        <div className="max-w-7xl mx-auto p-3">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
            <Link
              to="/create-category"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> Add Category
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                No categories found. Create your first category!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {category.name}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                          category.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.type
                          ? category.type.charAt(0).toUpperCase() +
                            category.type.slice(1)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => deleteCategory(category._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ backgroundColor: category.color || "#9CA3AF" }}
                    ></div>
                    <span className="text-sm text-gray-500">
                      {category.icon || "No icon"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Category;
