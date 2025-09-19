import express from 'express';
import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js';
import {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
} from '../controllers/categoryController.js';

const router = express.Router();

// ===============================
// 📌 CATEGORY ROUTES
// ===============================

// ✅ Create Category
router.post(
  '/create-category',
  requireSignIn,
  isAdmin,
  createCategoryController
);

// ✅ Update Category
router.put(
  '/update-category/:id',
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// ✅ Get All Categories
router.get('/get-category', categoryController);

// ✅ Get Single Category by Slug
router.get('/single-category/:slug', singleCategoryController);

// ✅ Delete Category
router.delete(
  '/delete-category/:id',
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
