
const User = require("../models/user")
const Question = require("../models/question")
const Answer = require("../models/answer")

exports.createAnswer=(req,res) =>{
    console.log(":ODE",req.question)
    console.log(req.user)
           
//     var ans=req.body.answer;
  
//     var author={id:req.user._id,
//         username:req.user.username};
// var answer={answer:ans,author:author};
Question.findById(req.question._id, function (err, question) {
if (err) {
    console.log(err);
    //res.redirect("/home");
} else {
    Answer.create(req.body, function (err, answer) {
        if (err) {
            console.log(err);
        } else {
            
            console.log(req.user._id)
            User.findById(req.user._id,function(err,user){
                
                if(err){
                    console.log(err);
                }

                else{
                    user.useranswers=user.useranswers.concat(answer);
                    answer.question.push(question);
                    answer.save();
                    user.save();
                }
            })
            //  question.answers=question.answers.concat([answer]);
            question.answers.push(answer);

            question.save();
           // res.redirect("/question/" + question._id);
           res.json({question:question,
                    answer:answer,
                })
        }
    });
}
});


}
