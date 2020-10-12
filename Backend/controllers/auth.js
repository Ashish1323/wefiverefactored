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
