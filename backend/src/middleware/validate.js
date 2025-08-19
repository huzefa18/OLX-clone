const {validationResult}=require('express-validator')

model.exports=function validate(req,res,next)
{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status:'fail',
                errors:errors.array().map(e=> {msg:e.msg})
            })
        }
        next();
}