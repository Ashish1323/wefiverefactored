var User= require("../models/user");


exports.getUserById=(req,res,next,id) => {
    User.findById(id,(err,user)=>{
        if(err || ! user){
            return res.status(403).json({
                error:"Unable to find user"
            })
        }
        req.user = user;
        next();
    })
}