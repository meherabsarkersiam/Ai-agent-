import { User } from "../models/usermodel.js"


export const login = async(req , res)=>{
    const {email , password} = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const finduser = await User.findByEmail(email)
        if (!finduser) {
            return res.status(400).json({ message: "User not found" })
            
        }
        const isavail = await finduser.checkPassword(password)
        if (!isavail) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = finduser.GenToken()
        const user = finduser.toObject()
        delete user.password
        delete user.verifyToken
        delete user.__v
        res.cookie("Access_Token",token)
        res.cookie("verifyToken",finduser.verifyToken)
        res.status(201).json({ message: "User logged in successfully",user, token })
        
    } catch (error) {
        res.status(500).json({status: false, message: 'unable to login user'});
    }
}