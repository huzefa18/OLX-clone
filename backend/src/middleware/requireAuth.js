const jet=require ('jsonwebtoken')
exports.requireAuth =(req,res ,next)=>{
    const auth=req.headers.authorization|| '';
    const token=auth.startsWith('Bearer ') ? slice(7):null;
    if(!token) res.status(401).json({
        status:'fail',
        err:'no token provided'
    });
    try{
        const payload=jwt.verify(token,process.env.JWT_ACCESS_SECRET);  
    req.user={id:payload.sub, tokenVersion:payload.tv};
    next();
    }
    catch(err)
    {
    return res.status(401).json({ status: "fail", msg: "Invalid or expired token" });
    }

}