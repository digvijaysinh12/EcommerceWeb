import express from 'express'
import formidable from 'express-formidable';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { createProductController, deleteProductController, getProductCotroller, getSingleProductController,productCategoryController,productCountController,productFiltersController,productListController,productPhotoController, realtedProductController, searchProductController, updateProductController } from '../controllers/createProductController.js';

const router = express.Router()

//routes

//Create Products Routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//Get Products
router.get('/get-product', getProductCotroller)


//Single Product
router.get('/get-product/:slug', getSingleProductController);


//Get Photo
router.get('/product-photo/:pid',productPhotoController);

//Delete Product
// Route to delete product by ID
router.delete('/delete-product/:pid',requireSignIn,isAdmin,formidable(), deleteProductController);


//update product
router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
  );

//filter product
router.post('/product-filter',productFiltersController);

//count product
router.get('/product-count',productCountController);

//product per page
router.get('/product-list/:page',productListController);

//FOR SEARCHING PRODUCTS
router.get('/search/:keyword',searchProductController);

//similar product
router.get(`/realted-product/:pid/:cid`, realtedProductController)

//categroy wise get product
router.get('/product-category/:slug',productCategoryController);

export default router;

