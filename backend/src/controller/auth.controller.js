const jet=rqeuire ('jsonwebtoken')
module.exporsts =function requireAuth(req,res ,next){
    const auth=req.headers.authorization|| '';
    const token=auth.startsWith('Bearer ') ? slice(7):null;
    if(!token) res.status(401).json({
        status:'fail',
        err:'no token provided'
    });
    const payload=
}