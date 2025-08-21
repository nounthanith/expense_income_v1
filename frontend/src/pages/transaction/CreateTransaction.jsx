import React, { useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, DollarSign, FileText, Tag, Check } from 'lucide-react';
import { api } from '../../utils/api';

function CreateTransaction() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  const [transaction, setTransaction] = useState({
    amount: '',
    description: '',
    type: 'income',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter categories by user ID
        const userCategories = response.data.data.filter(
          category => category.userId?._id === userId
        );
        setCategories(userCategories);
        
        // Set default category if available
        if (userCategories.length > 0) {
          setTransaction(prev => ({
            ...prev,
            category: userCategories[0]._id
          }));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, [token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!transaction.amount || transaction.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!transaction.description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    if (!transaction.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/transactions', {
        ...transaction,
        userId,
        amount: parseFloat(transaction.amount) // Ensure amount is a number
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/transaction');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
      console.error('Transaction error:', err);
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
                <Check className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Transaction Created!
              </h2>
              <p className="text-gray-600 mb-6">
                Your transaction has been successfully recorded.
              </p>
              <Link
                to="/transaction"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors inline-block"
              >
                Back to Transactions
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/transaction"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <ArrowLeft className="text-lg" /> Back to Transactions
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Add Transaction</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="text-gray-400" size={18} />
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="text-gray-400" size={18} />
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={transaction.description}
                  onChange={handleChange}
                  placeholder="e.g. Groceries, Salary, etc."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                      transaction.type === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-green-500">+</span> Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransaction(prev => ({ ...prev, type: 'expense' }))}
                    className={`py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                      transaction.type === 'expense'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-red-500">-</span> Expense
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="text-gray-400" size={18} />
                  Category
                </label>
                <select
                  name="category"
                  value={transaction.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} ({cat.type})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No categories available</option>
                  )}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="text-gray-400" size={18} />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={transaction.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || categories.length === 0}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-colors ${
                  loading || categories.length === 0
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {categories.length === 0 ? 'No Categories Available' : 'Add Transaction'}
                  </>
                )}
              </button>

              {categories.length === 0 && (
                <p className="text-sm text-center text-red-500 mt-2">
                  Please create a category first before adding transactions.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTransaction