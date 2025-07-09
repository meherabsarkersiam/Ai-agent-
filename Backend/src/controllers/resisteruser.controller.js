import {User} from "../models/usermodel.js"


export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const existedUser = await User.findByEmail(email)
    if (existedUser) {
        return res.status(400).json({ message: "User already exists" })
    }
    try {
        const hashedpassword =await User.encryptPassword(password)
         const verifyToken = User.GenVerifyToken(name) 

        const user =  await User.create({
            name,
            email,
            password: hashedpassword,
            verifyToken
        })
       if (user) {
       const verifyToken = user.verifyToken
        const user = user.toObject()
        delete user.password
        delete user.verifyToken
        delete user.__v
        const token = user.GenToken()
        res.cookie("Access_Token",token,)
        res.cookie("verifyToken",verifyToken,)
        res.status(201).json({ message: "User registered successfully",user, token })
       }
        
    } catch (error) {
   res.status(500).json({status: false, message: 'unable to register user'});
   
    }

}