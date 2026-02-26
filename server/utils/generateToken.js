import jwt from "jsonwebtoken"

export const generateToken = (data) =>{
    const token = jwt.sign(data,process.env.JWT_SECRET,{expiresIn:"7d"});
    return token
}