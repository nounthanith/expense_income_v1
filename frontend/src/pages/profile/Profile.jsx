import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import { api } from "../../utils/api";
import { FaUser } from "react-icons/fa";

function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-28 absolute top-24 w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>

          {loading && (
            <p className="text-center text-gray-600">Loading profile...</p>
          )}
          {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {!loading && !error && (
            <div className="bg-white shadow-md rounded-2xl p-6 md:p-10 flex flex-col items-center text-center">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-28 h-28 rounded-full object-cover shadow-md mb-4"
                />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 mb-4 shadow-md">
                  <FaUser size={40} />
                </div>
              )}

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
                {user.role}
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
