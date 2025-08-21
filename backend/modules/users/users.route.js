const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  logout,
  getUsers,
  updateProfile,
} = require("./users.controller");
const { authMiddleware } = require("../../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.put("/me", updateProfile);
router.post("/logout", logout);
router.get("/users", getUsers);

module.exports = router;
