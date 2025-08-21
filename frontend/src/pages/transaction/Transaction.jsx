import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import Navbar from "../../layouts/Navbar";

function Transaction() {
  const [transactions, setTransactions] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 absolute top-24 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex justify-between items-center mb-8 ">
            <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
            <Link
              to=""
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 w-fit "
            >
              <Plus size={18} /> Add Transaction
            </Link>
          </div>

          {/* Summary Cards */}
          

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {transactions.data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No transactions found. Add your first transaction to get
                      started.
                    </td>
                  </tr>
                ) : (
                  transactions.data.map((tx) => (
                    <tr
                      key={tx._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {format(new Date(tx.date), "MMM dd, yyyy")}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}$
                        {tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transaction;
