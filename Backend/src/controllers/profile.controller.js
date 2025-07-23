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