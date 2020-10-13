const User = require("../models/user")
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var crypto = require("crypto");
var async = require('async');
var nodemailer = require("nodemailer");





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



  
  exports.forgot = (req, res, next) => {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
          console.log(req.body);
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.json({
                "err":"email not found"
            });
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'wefivehelper@gmail.com',
            pass: 'wefive12345'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'wefivehelper@gmail.com',
          subject: 'We Five Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
         
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.json({
          "err":"mail not sent"
      });
    });
  };
  
  
  
  
 exports.generateToken=(req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        
        return res.json({
            "err":"user not found"
        });
      }
     return res.json( {token: req.params.token});
    });
  };
  
  
  
  exports.resetPassword=(req, res)=> {
      console.log("madarchod",req.params.token)
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.redirect('back');
          }
          if(req.body.password == req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              return res.json({
                  "err":"Passwords do not match"
              });
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'wefivehelper@gmail.com',
            pass: 'wefive12345'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'wefivehelper@gmail.com',
          subject: 'Your We Five password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ], function(err) {
      res.json({
          "err":"Something Went wrong mail not sent"
      });
    });
  };
