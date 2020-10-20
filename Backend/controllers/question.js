const User = require("../models/user")
const Question = require("../models/question")

// Create Question Api Controller!!
exports.createQuestion =(req,res)=>{

    // var author={id:req.user._id,
   // var username=req.user.name;
        var ques=req.body.question;
         var category= req.body.category;

    Question.create({question:ques ,category:category},function(err,newques){
        if(err){
            console.log(err);
        }
        else{
            // TODO: Create Question into User Schema!!


            User.findById(req.user._id,function(err,user){
                if(err){
                   res.json({error: err})
                }
                else{
                    user.userquestions=user.userquestions.concat(newques);
                    user.save();
                    res.json({user: user, ques:newques}) 
                    console.log(user)
                }
            })

            // res.json({
            //     
            // })
//     Question.find({}, function(err, question){
//     if (err) {
//         console.log(err);
//     } else {
//         var noMatch;
//          res.json( {question:question}); //data + name passing in
//     }   
// });
        }
})

// else{
// res.json({
//     err:"Not able to create question"
// });
// }
  } 

  exports.getQuestionById=(req,res,next,id) => {
    Question.findById(id,(err,question)=>{
        if(err || ! user){
            return res.status(403).json({
                error:"Unable to find question"
            })
        }
        req.question = question;
        next();
    })
}
