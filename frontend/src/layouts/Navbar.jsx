import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { api } from "../utils/api";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const navItem = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Transactions", link: "/transaction" },
    { name: "Profile", link: "/profile" },
    { name: "Category", link: "/category" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      }
    };
    fetchUser();
  }, [token]);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          Expense <span className="text-yellow-300">Tracker</span>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItem.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`px-3 py-2 rounded-md transition-all duration-200 ${
                location.pathname === item.link
                  ? "bg-white text-indigo-600 font-semibold"
                  : "hover:bg-indigo-500 hover:text-yellow-300"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border p-2 rounded-full bg-white text-indigo-600 hover:bg-gray-200"
            >
              <FaUser />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-10 right-0 bg-white text-gray-800 shadow-lg rounded-md p-4 w-48 border border-black">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="flex flex-col mt-3 gap-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 border border-indigo-600 rounded-md p-2"
                  >
                    <FiSettings /> Profile
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 border border-red-600 rounded-md p-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col bg-indigo-700 px-6 py-4 space-y-3">
          {navItem.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                location.pathname === item.link
                  ? "bg-white text-indigo-600 font-semibold"
                  : "hover:bg-indigo-500 hover:text-yellow-300"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile User Info */}
          <div className="mt-3 border-t border-indigo-500 pt-3">
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-indigo-200 text-sm">{user?.email}</p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-2 flex items-center gap-2 text-indigo-300 hover:text-white border border-indigo-400 rounded-md p-2"
            >
              <FiSettings /> Profile
            </button>
            <button
              onClick={logout}
              className="mt-2 flex items-center gap-2 text-red-300 hover:text-red-500 border border-red-600 rounded-md p-2"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
