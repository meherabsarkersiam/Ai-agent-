import User from "../models/usermodel.js"
import Project from "../models/projectmodel.js"

export const getprofile = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const email = req.user.email;
    const user = await User.findByEmail(email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const projects = await Project.find({ users: user._id });
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verifyToken;
    delete userObj.__v;

    res.send({ ...userObj, projects });
}

export const getid = async(req,res)=>{
    try {
        const useremail = req.user.email
        const user = await User.findByEmail(useremail)
        const userid = user._id
        if (!userid) {
           throw new Error("User not found")
        }
        res.send(userid)
    } catch (error) {
        res.status(500).json({status: false, message: 'unable to get user id'});
    }
}