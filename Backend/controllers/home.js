const User = require("../models/user")
const Question = require("../models/question")


exports.createQuestion =(req,res)=>{

    // var author={id:req.user._id,
    //     username:req.user.username};
        var ques=req.body.question;
        // var category= req.body.A;

    Question.create({question:ques},function(err,newques){
        if(err){
            console.log(err);
        }
        else{

            // User.findById(req.user._id,function(err,user){
            //     if(err){
            //         console.log(err);
            //     }
            //     else{
            //         user.userquestions=user.userquestions.concat(newques);
            //         user.save();
            //     }
            // })
            res.json({
                ques:newques
            })
    Question.find({}, function(err, question){
    if (err) {
        console.log(err);
    } else {
        var noMatch;
         res.json( {question:question}); //data + name passing in
    }   
});
        }
})

// else{
// res.json({
//     err:"Not able to create question"
// });
// }
  } 
