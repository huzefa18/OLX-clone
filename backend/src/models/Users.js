
const mongoose=require(mongoose)
const bycrpt=require(bycrpt)
const modile=require(module)
const userSchema=new moongoose.Schema({
    name: {type:String ,required:true, trim:true},
    email:{type:String ,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: 6
        
    },
      tokenVersion: { type: Number, default: 0 },
});
userSchema.pre('save',async function (next)
{
    if(!this.isModified)return next();
    const salt=await bycrpt.salt(10);
    const hash=await bycrpt.hash(this.password,salt);

    next();
})

userSchema.methods.comparePassword=function (txt)
{
    return bycrpt.compare(this.password,txt);
}


module.exports=moongoose.model('User',userSchema);

