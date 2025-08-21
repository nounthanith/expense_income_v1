import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import { api } from "../../utils/api";
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiUser, FiMail, FiCalendar } from "react-icons/fi";

function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
        setEditForm({
          name: response.data.data.name,
          email: response.data.data.email
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reset form
      setEditForm({
        name: user.name,
        email: user.email
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      // API call to update user info would go here
      // For now, just update local state
      setUser({ ...user, name: editForm.name, email: editForm.email });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 pt-24 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            {!loading && !error && (
              <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  isEditing 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-200"
                } transition-colors shadow-sm`}
              >
                {isEditing ? (
                  <>
                    <FaSave size={14} /> Save Changes
                  </>
                ) : (
                  <>
                    <FaEdit size={14} /> Edit Profile
                  </>
                )}
              </button>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-md">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md lg:col-span-1">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-indigo-100"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-500 mb-4 shadow-lg border-4 border-white">
                      <FaUser size={48} />
                    </div>
                  )}

                  {/* User Info */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 mb-3">{user.email}</p>
                  <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wide">
                    {user.role}
                  </span>
                  
                  <div className="w-full border-t border-gray-100 my-5"></div>
                  
                  <div className="flex items-center text-sm text-gray-500 w-full justify-center">
                    <FiCalendar className="mr-2" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-100">
                  Personal Information
                </h3>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiUser className="text-indigo-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{user.name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiMail className="text-indigo-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Email Address</p>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{user.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiUser className="text-indigo-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Role</p>
                      <p className="text-gray-800 font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <FiCalendar className="text-indigo-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Member Since</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;