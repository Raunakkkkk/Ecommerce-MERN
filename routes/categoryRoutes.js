import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';
const router=express.Router();

//routes
//create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController )

//update categroy
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)
export default router

//get all category
router.get('/get-category',categoryController)//isko sab access kr sakenge as isse se show krna hai

//sigle category

router.get('/single-category/:slug',singleCategoryController);
//slug is params


//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryCOntroller)