import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
export const registerController=async(req,res)=>{
try {
    const {name,email,password,phone,address,answer}=req.body;
//validation checking ki kahi empty na ajaye
if(!name){
    return res.send({
        message:"name is required"
    })
}
if(!answer){
    return res.send({
        message:"answer is required"
    })
}
if(!email){
    return res.send({
        message:"email is required"
    })
}
if(!password){
    return res.send({
        message:"password is required"
    })
}
if(!phone){
    return res.send({
        message:"phone is required"
    })
}
if(!address){
    return res.send({
        message:"address is required"
    })
}

//checking if existing user exist
//checking in db that if  user with same email exist
const existingUser=await userModel.findOne({email})

//existing user
if(existingUser){
    return res.status(200).send({
        success:false,
        message:"User already Exists"
    })
}

//if not present then register
//password ko hash krenge pehle
const hashedPassword=await hashPassword(password);
//saving in db
const user= await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();

res.status(201).send({
    success:true,
    message:"User registered Sucessfully",
    user
});




} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error in Registeration",
        error
    })
}
}


//post login

export const loginController=async(req,res)=>{
    try {
        const{email,password}=req.body;
        //validation 
        if (!email || !password) {
            res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        
//check user
//db se user nikal rhe 
const user=await userModel.findOne({email});

if(!user){
    return res.status(404).send({
        success:false,
        message:"Email is not registered"
    })
}


    const match=await comparePassword(password,user.password)
      if(!match){
        //mtlb password compare kra aur vo result nhi aya kyuki worng password
        return res.status(200).send({
            success:false,
            message:"invalid password"
        })
      }
//agar sab sahi haito
//token
const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
//ye to

res.status(200).send({
success:true,
message:"login successfully",
user:{
    _id:user._id,
    name:user.name,
    email:user.email,
    phone:user.phone,
    address:user.address,
    role:user.role

},
token
})

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
}

//forogotpassword
export const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Emai is required" });
      }
      if (!answer) {
        res.status(400).send({ message: "answer is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, answer });
      //user ajayega db se
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };

//update profile

export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };



//test controller
export const testController=(req,res)=>{
    res.send('protected route');
}