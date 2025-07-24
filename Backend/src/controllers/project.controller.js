import mongoose from "mongoose"
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
    try {
        const { adduserid } = req.body;
        const projectid = req.params.id;
        const currentuser = req.user;

        if (!projectid || !adduserid || !Array.isArray(adduserid)) {
           throw new Error("All fields are required and 'adduserid' must be an array" );
        }

        const currentuserdoc = await User.findOne({ email: currentuser.email });
        if (!currentuserdoc) {
            throw new Error( "Logged-in user not found" );
        }

        const userid = currentuserdoc._id;

        const project = await Project.findOne({ _id: projectid, users: userid });
        if (!project) {
             throw new Error("Project not found or access denied" );
        }

        const alreadyAddedUsers = project.users.map(u => u.toString());
        const duplicateUser = adduserid.find(id => alreadyAddedUsers.includes(id));

        if (duplicateUser) {
            throw new Error("One or more users are already added to the project" );
        }

        const adduserservice = await addusertoproject({ projectid, adduserid });

        if (!adduserservice) {
             throw new Error( "Failed to add user(s) to project" );
        }

        return res.status(200).json({ message: "User(s) added to project successfully", adduserservice });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" });
    }
};

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

export const deleteuser = async (req, res) => {
  try {
    const { deleteuserid } = req.body;
    const projectid = req.params.id;
    const reqsenderEmail = req.user?.email;

    if (!deleteuserid) throw new Error("User ID to delete is missing.");
    if (!reqsenderEmail) throw new Error("User not logged in.");
    if (!projectid) throw new Error("Project ID is missing.");

    // Check if requesting user exists
    const currentUser = await User.findOne({ email: reqsenderEmail });
    if (!currentUser) throw new Error("Requesting user not found.");

    // Check if the user is the project creator
    const project = await Project.findOne({ _id: projectid, creator: currentUser._id });
    if (!project) throw new Error("You are not authorized to delete users from this project.");

    // Delete user from project
    const updatedProject = await Project.findByIdAndUpdate(
      projectid,
      { $pull: { users: new mongoose.Types.ObjectId(deleteuserid) } },
      { new: true }
    );

    if (!updatedProject) throw new Error("Failed to remove user from project.");

    return res.json({ message: "User removed from project successfully." });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Something went wrong."
    });
  }
};
