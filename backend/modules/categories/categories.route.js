const { Router } = require("express");
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("./categories.controller");
const { authMiddleware } = require("../../middleware/auth");

const router = Router();

router.post("/categories", authMiddleware, createCategory);
router.get("/categories", authMiddleware, getCategories);
router.get("/categories/:id", authMiddleware, getCategoryById);
router.put("/categories/:id", authMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

module.exports = router;
