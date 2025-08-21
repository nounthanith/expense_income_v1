const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["expense", "income"], // only allow these two
    },
    color: {
      type: String,
      default: "#000000", // you can use this for frontend chart color
    },
    icon: {
      type: String,
      default: "default-icon", // optional icon name for frontend (e.g. "shopping-cart")
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false, // mark if it's a system category or user-created
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
