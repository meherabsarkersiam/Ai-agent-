
export const logout =(req,res)=>{
    res.clearCookie("Access_Token")
    res.clearCookie("verifyToken")
    res.status(201).json({ message: "User logged out successfully" })
}