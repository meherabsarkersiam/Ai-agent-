import mongoose from "mongoose";
import Project from "../models/projectmodel.js";

export const createProject = async ({Projectname,userId}) => {
  if (!Projectname || !userId) {
    throw new Error("All fields are required");
  }
  try {

    const project = await Project.create({ Projectname, creator: userId , users:[userId]});
    return project;
  } catch (error) {
    throw new Error("Failed to create project");
    
  }

}

export const addusertoproject = async({projectid ,adduserid})=>{

  if(!mongoose.Types.ObjectId.isValid(projectid) || !adduserid){
   throw new Error("Invalid project id")
  }
  try {

   const updatedproject = await Project.findOneAndUpdate(
    {
    _id:projectid
  },{
     $addToSet: {
            users: {
                $each: adduserid
            }
        }
  }
   )
   return updatedproject
    
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add user to project")
    
  }
}


