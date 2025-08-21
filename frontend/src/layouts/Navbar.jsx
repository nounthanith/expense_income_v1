import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../utils/api";
import { FaUser } from "react-icons/fa";
import {
  FiLogOut,
  FiSettings,
  FiPieChart,
  FiCreditCard,
  FiFolder,
  FiHome,
} from "react-icons/fi";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");

  const navItems = [
    { name: "Dashboard", link: "/dashboard", icon: <FiPieChart size={18} /> },
    { name: "Transactions", link: "/transaction", icon: <FiCreditCard size={18} /> },
    { name: "Category", link: "/category", icon: <FiFolder size={18} /> },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.data;
        setUser(userData);
        // Store user ID in local storage for other components to use
        if (userData?._id) {
          localStorage.setItem("userId", userData._id);
        }
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };
    
    if (token) {
      fetchUser();
    }
  }, [token]);

  // Close dropdown when clicking outside (only desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg fixed top-0 w-full z-50 border-b border-indigo-500/30">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-indigo-600 font-bold text-lg">ET</span>
          </div>
          <h1 className="text-xl font-bold tracking-wide hidden sm:block">
            Expense <span className="text-yellow-300">Tracker</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.link
                  ? "bg-white/10 text-white backdrop-blur-sm shadow-inner"
                  : "hover:bg-white/5 hover:text-yellow-200"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* User Dropdown */}
          <div className="relative user-dropdown ml-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/15 transition-colors border border-white/10"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <FaUser className="text-white" size={14} />
                </div>
              )}
              <span className="max-w-[120px] truncate hidden lg:block">
                {user?.name}
              </span>
              {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white text-gray-800 shadow-xl rounded-xl p-3 w-56 border border-gray-200/80 z-50">
                <div className="flex items-center gap-3 p-2 border-b border-gray-100">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUser className="text-indigo-600" size={16} />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-col mt-2 gap-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                  >
                    <FiSettings size={16} /> Profile Settings
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-1"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Drawer - FIXED POSITIONING */}
          <div className="fixed top-16 left-0 right-0 h-[calc(100vh-4rem)] bg-indigo-700 text-white z-50 md:hidden overflow-y-auto shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-indigo-600 rounded-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                    <FaUser className="text-white" size={20} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-indigo-200 text-xs">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.link
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5 hover:text-yellow-200"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-indigo-500/30 my-2"></div>

              {/* Additional Menu Items */}
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-white/5 hover:text-white transition-colors"
              >
                <FiSettings size={18} /> Profile Settings
              </button>

              <button
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-white/5 hover:text-white transition-colors"
              >
                <FiHome size={18} /> Home
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-100 transition-colors mt-2"
              >
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;