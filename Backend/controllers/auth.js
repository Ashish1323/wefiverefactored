const User = require("../models/user")
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');





exports.signup=(req,res) => {

    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            "err":errors.array()[0].msg,
            "error place":errors.array()[0].param
        })
    }


    const user = new User(req.body);
    console.log(req.body);
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                message:err
            })
        }
        else{
            res.json(user)
        }

    })

   
}


exports.signin=(req,res) => {
    const {email,password} = req.body
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            "err":errors.array()[0].msg,
            "error place":errors.array()[0].param
        })
    }

    User.findOne({email:email} ,(err,user) => {
        if(err || !user) {
            return res.status(400).json({
                err: "Email doesn't exist"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                err: "Password doesn't match to the email"
            })
        }
        //create token 
        const token= jwt.sign({_id:user._id}, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});
        //send response to front end
        const {_id,name,email} = user
        return res.json({token, user:{ _id,name,email }});
   });
}

exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.send("User is signed out")
}

// protected route
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
})