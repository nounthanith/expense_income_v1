const express = require("express");
const router = express.Router();
const { addTransaction, getTransactions, getSummary, updateTransaction, deleteTransaction } = require("./transaction.controller");
const { authMiddleware } = require("../../middleware/auth");

router.post("/transactions", authMiddleware, addTransaction);
router.get("/transactions", authMiddleware, getTransactions);
router.get("/transactions/summary", authMiddleware, getSummary);
router.put("/transactions/:id", authMiddleware, updateTransaction);
router.delete("/transactions/:id", authMiddleware, deleteTransaction);

module.exports = router;
