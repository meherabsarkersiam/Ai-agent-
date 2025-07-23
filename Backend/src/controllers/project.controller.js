import Project from "../models/projectmodel.js"
import User from "../models/usermodel.js"
import { addusertoproject, createProject } from "../services/project.service.js"

export const projectcontroller = async (req, res) => {
    try {
        const user = req.user
        const Projectname = req.body.name
        if (!Projectname) {
            throw new Error( "All fields are required" );
        }
        const userdocs = await User.findOne({ email: user.email })
        if (!userdocs) {
            throw new Error("User not found" );
        }
        const userId = userdocs._id
        const alreadyexist = await Project.findOne({ Projectname, creator: userId });
        if (alreadyexist) {
           throw new Error({ message: "Project already exists" });
        }
        const createdproject = await createProject({ Projectname, userId })
        if (!createdproject) {
            throw new Error({ message: "Failed to create project" });
        }
        else {
            return res.json({ message: "Project created successfully", createdproject });

        }
    } catch (error) {
        res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
}



export const getprojects = async (req, res) => {
    const user = req.user
    if (!user) {
        res.send({ message: "User not found" });
    }

    try {
        const userdocs = await User.findOne({ email: user.email })
        if (!userdocs) {
            return res.send({ message: "User not found" });
        }
        const userId = userdocs._id
        const projects = await Project.find({ users: userId })
        res.send(projects)

    } catch (error) {
        console.log(error);
        res.send({ message: "Failed to get projects" });

    }
}


export const adduser = async (req, res) => {
    const { projectid, users } = req.body
    const currentuser = req.user
    const currentuserdoc = await User.findOne({ email: currentuser.email })
    const userid = currentuserdoc._id
    if (!projectid || !users) {
        return res.json({ message: "All fields are required" });
    }
    if (!userid) {
        return res.json({ message: "logdin user not found" });
    }
    const project  = await Project.findOne({_id:projectid,users:userid}) 
     const alreadyaddedusers = project.users
    
    if(!project){
      throw new Error("Project not found")
    }
   const duplicateuser = alreadyaddedusers.find((user)=>{
     return users.includes(user.toString())
   })
   if (duplicateuser) {
   return res.json({ message: "User already added to project" });
    
   }
    const adduserservice = await addusertoproject({ projectid, userid, users })
    if (!adduserservice) {
        return res.json({ message: "Failed to add user to project" });
    }
    else {
        return res.json({ message: "User added to project successfully", adduserservice });
        
    }
}

export const deleteproject = async (req, res) => {
  try {
    const projectid = req.params.id;
    const deletorEmail = req.user?.email;

    if (!deletorEmail) {
      return res.status(401).json({ message: "Unauthorized: User email not found" });
    }

    const user = await User.findOne({ email: deletorEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userid = user._id;

    // Check if the user is the creator of the project
    const project = await Project.findById(projectid);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.creator.equals(userid)) {
      return res.status(403).json({ message: "You are not authorized to delete this project" });
    }

    const deletedproject = await Project.findByIdAndDelete(projectid);

    return res.status(200).json({
      message: `${deletedproject?.Projectname || 'Project'} deleted successfully`,
    });

  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const projectdetails = async (req, res) => {
    const user = req.user
    if (!user) {
        return res.json({ message: "User not found" });
    }
    const projectid = req.params.id
    if (!projectid) {
        return res.json({ message: "something went wrong" });
    }
  try {
    const curuser = await User.findOne({email:user.email})
    if (!curuser) {
      return res.json({ message: "User not found" });
    }
    const curuserid = curuser._id
    
    if (!curuserid) {
      return res.json({ message: "User not added to project" });
    }
    const project = await Project.findById(projectid)
    if (!project) {
      return res.json({ message: "Project not found" });
      
    }
    if (project) {
      
      const userdetails = project.users.filter((id)=>id.toString() !== curuserid.toString())
     const modifiedproject = project.toObject()
      delete modifiedproject.__v
      delete modifiedproject.users
     const cleanproject = {
      ...modifiedproject,
      userdetails
     }
      return res.json({ message: "Project details", cleanproject });
    }
    
   
  } catch (error) {
    throw new Error("Failed to get project details")
  }
}
