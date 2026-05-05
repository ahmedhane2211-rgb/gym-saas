const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // req.user يتم تعريفه عادة بعد فك تشفير الـ Token في الـ Authentication middleware
    const userRole = req.user.role; 

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: "غير مسموح لك بالوصول لهذا المصدر", 
        status: false 
      });
    }
    next();
  };
};

export default authorize;