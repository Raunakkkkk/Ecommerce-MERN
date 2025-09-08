import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.js'
import cors from 'cors'
import categoryRoute from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
// import path from 'path';
//config env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
//ye cros origin error bachane ke liye
app.use(express.json());
app.use(morgan("dev"));//ye req batata hai console pr
// app.use(express.static(path.join(__dirname,'./client/build')))



//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoute);
app.use("/api/v1/product", productRoutes);


// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Ecommerce APP</h1>");
});
// app.use('*',function(req,res){
// res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })


const PORT = process.env.PORT || 8080;
// run listen
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`.bgCyan.white);
});
