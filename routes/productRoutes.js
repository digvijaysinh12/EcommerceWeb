import express from 'express';
import formidable from 'express-formidable';
import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js';
import {
  createProductController,
  getProductCotroller,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
} from '../controllers/ProductController.js';

const router = express.Router();

// ===============================
// 📌 PRODUCT ROUTES
// ===============================

// ✅ Create Product
router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// ✅ Get All Products
router.get('/get-product', getProductCotroller);

// ✅ Get Single Product (by slug)
router.get('/get-product/:slug', getSingleProductController);

// ✅ Get Product Photo
router.get('/product-photo/:pid', productPhotoController);

// ✅ Update Product
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// ✅ Delete Product
router.delete(
  '/delete-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  deleteProductController
);

// ===============================
// 📌 PRODUCT FILTERS & PAGINATION
// ===============================

// ✅ Filter Products
router.post('/product-filter', productFiltersController);

// ✅ Count Total Products
router.get('/product-count', productCountController);

// ✅ Products Per Page (Pagination)
router.get('/product-list/:page', productListController);

// ✅ Search Products
router.get('/search/:keyword', searchProductController);

// ✅ Related Products
router.get('/realted-product/:pid/:cid', realtedProductController);

// ✅ Products by Category
router.get('/product-category/:slug', productCategoryController);

// ===============================
// 📌 PAYMENT ROUTES
// ===============================

// ✅ Get Braintree Token
router.get('/braintree/token', braintreeTokenController);

// ✅ Make Payment
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);

export default router;
