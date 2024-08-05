import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//protected routes token base
export const requireSignIn=async(req,res,next)=>{
  try {
    const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET);//ye token verify hoga

    //humlog jwt mai sign kr rhe user ki id se(_id ) aur verify hone ke bad vahi user mai dal dere
    req.user=decode;
    next();
  } catch (error) {
    console.log(error);

  }

}

//admin access
export const isAdmin=async(req,res,next)=>{
    try {
        //first check if user is admin
        //ye req.user upar requireSignIn se ara not that user jo controller mai hai
        const user=await userModel.findById(req.user._id);
    if(user.role!==1){
        return res.status(401).send({
            success:false,
            message:"UnAuthorized access user not admin"
        })
    }
    else{
        next();
    }
        
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"error in admin middleware"
        })
    }
}