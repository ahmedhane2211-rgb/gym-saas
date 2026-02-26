import jwt from "jsonwebtoken"

export const authUser = async(req,res,next)=>{
    try {
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({message:"الرجاء توفير التوكن",status:false})
        }
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);  
        console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:error.message,status:false})
    }
}