import express from 'express';
import { registerController ,loginController, testController, forgotPasswordController, updateProfileController} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
//router object

const router =express.Router();

//routing
//Register // method post
router.post('/register',registerController);


//login post route

router.post('/login',loginController);

//forget pass
router.post('/forgot-password',forgotPasswordController);



//protected route
//cjust checking if user is valid
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

  //admin route
router.get("/admin-auth", requireSignIn, isAdmin,(req, res) => {
    res.status(200).send({ ok: true });
  });

  //update profile
  router.put('/profile',requireSignIn,updateProfileController)
  

//test toute
router.get('/test',requireSignIn,isAdmin,testController);//checking user is admin and logged in

export default router;