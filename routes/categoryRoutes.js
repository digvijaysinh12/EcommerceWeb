import express from 'express'
import { requireSignIn,isAdmin } from '../middleware/authMiddleware.js'
import {categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController} from '../controllers/categoryController.js'
const router = express.Router()

//routes
//create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

// get all cat
router.get('/get-category', categoryController)

//single Category
router.get('/single-category/:slug', singleCategoryController)

//delete Category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)
export default router