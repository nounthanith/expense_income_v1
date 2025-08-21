import React, { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";
import { api } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { FiArrowUp, FiArrowDown, FiDollarSign, FiPieChart, FiTrendingUp } from "react-icons/fi";

function Dashboard() {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month"); // month, week, year

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
  }, [token, timeRange]);

  // Chart data for bar chart
  const chartData = [
    { name: "Income", value: transactions.income || 0 },
    { name: "Expense", value: transactions.expense || 0 },
  ];

  // Data for pie chart
  const pieData = [
    { name: "Income", value: transactions.income || 0 },
    { name: "Expense", value: transactions.expense || 0 },
  ];

  // Colors for pie chart segments
  const COLORS = ['#4ade80', '#f87171'];

  // Calculate net balance
  const netBalance = (transactions.income || 0) - (transactions.expense || 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 pt-24 w-full">
        {loading && (
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-10"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-200 rounded-2xl"></div>
                <div className="h-80 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                  <button
                    onClick={() => setTimeRange("week")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      timeRange === "week" 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeRange("month")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      timeRange === "month" 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeRange("year")}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      timeRange === "year" 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Balance</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      ${netBalance.toFixed(2)}
                    </h2>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <FiDollarSign className="text-indigo-600 text-xl" />
                  </div>
                </div>
                <div className={`flex items-center mt-4 text-sm ${
                  netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netBalance >= 0 ? (
                    <FiArrowUp className="mr-1" />
                  ) : (
                    <FiArrowDown className="mr-1" />
                  )}
                  <span>{netBalance >= 0 ? 'Positive' : 'Negative'} Balance</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {transactions.totalTransactions || 0}
                    </h2>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100">
                    <FiTrendingUp className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <span>All time transactions</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-700 mt-1">
                      ${transactions.income || 0}
                    </h2>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100">
                    <FiArrowUp className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-600">
                  <FiArrowUp className="mr-1" />
                  <span>Income</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Expense</p>
                    <h2 className="text-2xl font-bold text-red-700 mt-1">
                      ${transactions.expense || 0}
                    </h2>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100">
                    <FiArrowDown className="text-red-600 text-xl" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-red-600">
                  <FiArrowDown className="mr-1" />
                  <span>Expense</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income vs Expense Bar Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Income vs Expense
                  </h2>
                  <FiTrendingUp className="text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} barSize={80}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4ade80' : '#f87171'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Income vs Expense Pie Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Financial Distribution
                  </h2>
                  <FiPieChart className="text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Insights Section */}
            
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;