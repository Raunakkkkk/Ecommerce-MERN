import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController= async(req,res)=>{
    try {
        const {name}=req.body;
        if(!name)
        return res.status(401).send({message:"name is required"
    })
//checking same nam se 2 category na ho
const existingCategory=await categoryModel.findOne({name});
if(existingCategory){
    return res.status(200).send({
        success:true,
        message:"Category already exist",
        category
    })
}

//nhi mili to categroy save krado
const category=await new categoryModel({name,slug:slugify(name)}).save();
res.status(201).send({
    success:true,
    message:"new category creaeted",

})



    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:true,
            error,
            message:"error in category"
        });

    }

} 


//updatee category
export const updateCategoryController = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const category = await categoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true }
      );
      res.status(200).send({
        success: true,
        messsage: "Category Updated Successfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while updating category",
      });
    }
  };

  //get all categroy
  export const categoryController = async (req, res) => {
    try {
      const category = await categoryModel.find({});//sending all categorires
// alert("test successfull");
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };
  
  // single category
export const singleCategoryController = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: true,
        message: "Get SIngle Category SUccessfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single Category",
      });
    }
  };

  //delete category
export const deleteCategoryCOntroller = async (req, res) => {
    try {
      const { id } = req.params;
      await categoryModel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Categry Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while deleting category",
        error,
      });
    }
  };