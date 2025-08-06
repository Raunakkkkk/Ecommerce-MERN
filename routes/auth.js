import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
  deleteUserController,
  getUserOrdersController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//router object

const router = express.Router();

//routing
//Register // method post
router.post("/register", registerController);

//login post route

router.post("/login", loginController);

//forget pass
router.post("/forgot-password", forgotPasswordController);

//protected route
//cjust checking if user is valid
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//test toute
router.get("/test", requireSignIn, isAdmin, testController); //checking user is admin and logged in

//orders
router.get("/orders", requireSignIn, getOrdersController);
//allorders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

// Get all users (admin only)
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

// Delete user (admin only)
router.delete("/delete-user/:id", requireSignIn, isAdmin, deleteUserController);

// Get user orders (admin only)
router.get(
  "/user-orders/:userId",
  requireSignIn,
  isAdmin,
  getUserOrdersController
);

export default router;
