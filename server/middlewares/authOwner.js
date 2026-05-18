import jwt from "jsonwebtoken"
export const authOwner = (req, res, next) => {
   const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({message:"الرجاء توفير التوكن",status:false})
        }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.role;
    if (userRole !== "owner") {
        return res.status(403).json({ 
            message: "غير مسموح لك بالوصول لهذا المصدر", 
            status: false 
        });
    }
    
    next();
};