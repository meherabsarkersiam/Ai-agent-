
import jwt from 'jsonwebtoken'
export const authmiddleware = (req,res,next)=>{
try {
    const token = req.cookies.Access_Token
    if(!token){
        req.user = null
        return next()
    }
    if(token){

        const verifyToken = jwt.verify(token,process.env.SECRET_KEY)
        console.log(verifyToken);
        
        req.user = verifyToken
        
        return next()
    }
} catch (error) {
    req.user = null
    return next()
}
}