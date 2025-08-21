const Category = require("../categories/categories.model");
const Transaction = require("./transaction.model");

// ✅ Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const { amount, description, date, type, category } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0)
      return res.status(400).json({ success: false, message: "A valid positive amount is required" });

    // Validate type
    if (!type || !['expense', 'income'].includes(type))
      return res.status(400).json({ success: false, message: "Valid type (expense/income) is required" });

    // Validate category
    if (!category)
      return res.status(400).json({ success: false, message: "Category is required" });

    // Validate date
    const transactionDate = date ? new Date(date) : new Date();
    if (isNaN(transactionDate.getTime()))
      return res.status(400).json({ success: false, message: "Invalid date format" });

    // Check category exists & type matches
    const categoryDoc = await Category.findOne({
      _id: category,
      $or: [
        { userId: req.user.id, type },
        { isDefault: true, type }
      ]
    });
    if (!categoryDoc)
      return res.status(404).json({ success: false, message: "Category not found or type mismatch" });

    // Create transaction (amount as Number with 2 decimals)
    const newTransaction = await Transaction.create({
      amount: Math.round(parseFloat(amount) * 100) / 100,
      description: description?.trim(),
      date: transactionDate,
      type,
      category,
      userId: req.user.id,
    });

    // Populate category for response
    const populatedTransaction = await Transaction.findById(newTransaction._id)
      .populate('category', 'name type color icon');

    res.status(201).json({ success: true, message: "Transaction added successfully", data: populatedTransaction });
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add transaction",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Get Transactions (with filters & pagination)
exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId: req.user.id };

    // Date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) return res.status(400).json({ success: false, message: 'Invalid start date format' });
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) return res.status(400).json({ success: false, message: 'Invalid end date format' });
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Category filter
    if (category) {
      const validCategory = await Category.findOne({
        _id: category,
        $or: [{ userId: req.user.id }, { isDefault: true }]
      });
      if (!validCategory) return res.status(404).json({ success: false, message: 'Category not found or access denied' });
      query.category = category;
    }

    // Type filter
    if (type && ['expense', 'income'].includes(type)) query.type = type;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('category', 'name type color icon')
        .populate('userId', 'name email')
        .select('-__v')
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transactions
    });
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ✅ Get Summary (income, expense, balance)
exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    const matchQuery = { userId: req.user.id };
    if (Object.keys(dateFilter).length) matchQuery.date = dateFilter;
    if (category) matchQuery.category = category;

    const summary = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          income: { $sum: { $cond: [{ $eq: ['$_id', 'income'] }, '$total', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$_id', 'expense'] }, '$total', 0] } },
          totalTransactions: { $sum: '$count' }
        }
      },
      { $project: { _id: 0, income: { $round: ['$income', 2] }, expense: { $round: ['$expense', 2] }, balance: { $round: [{ $subtract: ['$income', '$expense'] }, 2] }, totalTransactions: 1 } }
    ]);

    const result = summary[0] || { income: 0, expense: 0, balance: 0, totalTransactions: 0 };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Get Summary Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch summary', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ✅ Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, type, category } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'Invalid transaction ID format' });

    const transaction = await Transaction.findOne({ _id: id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found or access denied' });

    if (amount !== undefined) {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) return res.status(400).json({ success: false, message: 'Amount must be positive number' });
      transaction.amount = Math.round(num * 100) / 100;
    }

    if (date) {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) return res.status(400).json({ success: false, message: 'Invalid date format' });
      transaction.date = newDate;
    }

    if (category) {
      const categoryExists = await Category.findOne({ _id: category, $or: [{ userId: req.user.id }, { isDefault: true }] });
      if (!categoryExists) return res.status(404).json({ success: false, message: 'Category not found or access denied' });

      if (type && categoryExists.type !== type) return res.status(400).json({ success: false, message: `Type must match category type (${categoryExists.type})` });

      transaction.category = category;
    }

    if (type && ['expense', 'income'].includes(type)) {
      // Check consistency with existing category
      if (transaction.category) {
        const cat = await Category.findById(transaction.category);
        if (cat && cat.type !== type) return res.status(400).json({ success: false, message: `Type must match category type (${cat.type})` });
      }
      transaction.type = type;
    }

    if (description !== undefined) transaction.description = description.trim();

    const updatedTransaction = await transaction.save();
    await updatedTransaction.populate('category', 'name type color icon');

    res.status(200).json({ success: true, message: 'Transaction updated successfully', data: updatedTransaction });
  } catch (error) {
    console.error('Update Transaction Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update transaction', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ✅ Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'Invalid transaction ID format' });

    const deleted = await Transaction.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Transaction not found or access denied' });

    res.status(200).json({ success: true, message: 'Transaction deleted successfully', data: { id } });
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete transaction', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};
