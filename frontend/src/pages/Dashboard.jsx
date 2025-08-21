import React, { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";
import { api } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function Dashboard() {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/transactions/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch transactions");
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const chartData = [
    { name: "Income", value: transactions.income || 0 },
    { name: "Expense", value: transactions.expense || 0 },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 absolute top-24 w-full">
        {loading && (
          <p className="text-center text-gray-600">Loading profile...</p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}
        {!loading && !error && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your dashboard!</p>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-6 bg-white shadow rounded-2xl">
                <p className="text-gray-500">Total Transactions</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {transactions.totalTransactions || 0}
                </h2>
              </div>
              <div className="p-6 bg-green-100 shadow rounded-2xl">
                <p className="text-gray-600">Total Income</p>
                <h2 className="text-2xl font-bold text-green-700">
                  ${transactions.income || 0}
                </h2>
              </div>
              <div className="p-6 bg-red-100 shadow rounded-2xl">
                <p className="text-gray-600">Total Expense</p>
                <h2 className="text-2xl font-bold text-red-700">
                  ${transactions.expense || 0}
                </h2>
              </div>
            </div>

            {/* Income vs Expense Chart */}
            <div className="mt-10 p-6 bg-white shadow rounded-2xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Income vs Expense
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barSize={80}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
