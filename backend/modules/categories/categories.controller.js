const Category = require("./categories.model");

// ✅ Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name: name.trim(),
      userId: req.user.id, // Changed from req.user._id to req.user.id
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      color: color || "#000000",
      icon: icon || "default-icon",
      userId: req.user.id, // Changed from req.user._id to req.user.id
      isDefault: false,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Get All Categories (User specific + Default)
exports.getCategories = async (req, res) => {
  try {
    const search = req.query.search || null;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const categoryId = req.query.categoryId || null;
    const skip = (page - 1) * limit;

    let queryObject = {};

    if (search) queryObject = { name: { $regex: search, $options: "i" } };

    if (categoryId) queryObject.category = categoryId;
    const categories = await Category.find(queryObject)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .populate("userId"); // Sort defaults first, then by name

    const totalDocs = await Category.countDocuments(queryObject);
    const totalPages = Math.ceil(totalDocs / limit);

    res.status(200).json({
      success: true,
      count: categories.length,
      totalPages,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user.id }, { isDefault: true }],
    }).populate("userId");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    const updates = {};

    // Only include fields that are provided in the request
    if (name) updates.name = name.trim();
    if (type) updates.type = type;
    if (color) updates.color = color;
    if (icon) updates.icon = icon;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid updates provided",
      });
    }

    const category = await Category.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id, // Only allow updating user's own categories
        isDefault: false, // Prevent updating default categories
      },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("userId");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or cannot be updated",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    // First check if category exists and belongs to user
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDefault: false, // Prevent deleting default categories
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or cannot be deleted",
      });
    }

    // TODO: Check if category is being used in any transactions before deleting
    // const isUsed = await Transaction.exists({ categoryId: req.params.id });
    // if (isUsed) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Cannot delete category - it's being used in transactions"
    //   });
    // }

    await Category.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
