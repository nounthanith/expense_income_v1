import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Plus, Filter, Search, Download, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import Navbar from "../../layouts/Navbar";

function Transaction() {
  const [transactions, setTransactions] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const token = localStorage.getItem("token");

  const summary = useMemo(() => {
    return transactions.data.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  // Filter transactions based on search and filter
  const filteredTransactions = useMemo(() => {
    return transactions.data.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "all" || tx.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [transactions.data, searchTerm, filterType]);

  

  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions({
          data: response.data.data || [],
          total: response.data.total || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 pt-24 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="flex gap-4 mb-8">
                <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 pt-24 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 pt-24 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
              <p className="text-gray-600 mt-1">Manage your income and expenses</p>
            </div>
            <Link
              to="/create-transaction"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 w-fit mt-4 md:mt-0 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={18} /> Add Transaction
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {transactions.total}
                  </h2>
                </div>
                <div className="p-3 rounded-lg bg-indigo-100">
                  <span className="text-indigo-600 font-semibold">All</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Income</p>
                  <h2 className="text-2xl font-bold text-green-700 mt-1">
                    ${summary.income.toFixed(2)}
                  </h2>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <ArrowUp className="text-green-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Expense</p>
                  <h2 className="text-2xl font-bold text-red-700 mt-1">
                    ${summary.expense.toFixed(2)}
                  </h2>
                </div>
                <div className="p-3 rounded-lg bg-red-100">
                  <ArrowDown className="text-red-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                
                <button className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download size={18} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th> 
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Search className="text-gray-400" size={24} />
                          </div>
                          <p className="font-medium">No transactions found</p>
                          <p className="text-sm mt-1">
                            {searchTerm || filterType !== "all" 
                              ? "Try adjusting your search or filter" 
                              : "Add your first transaction to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${
                              tx.type === "income" 
                                ? "bg-green-100 text-green-600" 
                                : "bg-red-100 text-red-600"
                            }`}>
                              {tx.type === "income" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )}
                            </div>
                            <div>
                              <div className="text-gray-900 font-medium">
                                {tx.description}
                              </div>
                              {tx.note && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {tx.note}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                            {tx.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {format(new Date(tx.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tx.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`font-bold ${
                            tx.type === "income" ? "text-green-700" : "text-red-700"
                          }`}>
                            {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex justify-end h-[100%] mt-2">
                          <div className="flex items-center gap-2 h-[100%]">
                            <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => deleteTransaction(tx._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination (optional) */}
            {filteredTransactions.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredTransactions.length}</span> of{" "}
                    <span className="font-medium">{transactions.total}</span> transactions
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Transaction;