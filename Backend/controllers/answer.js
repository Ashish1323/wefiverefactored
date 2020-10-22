
const User = require("../models/user")
const Question = require("../models/question")
const Answer = require("../models/answer")

exports.createAnswer=(req,res) =>{
   
           
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

exports.getAnswerById=(req,res,next,id) => {
    Answer.findById(id,(err,answer)=>{
        if(err || ! answer){
            return res.status(403).json({
                error:"Unable to find question"
            })
        }
        req.answer = answer;
        next();
    })
}



// edit answer
exports.updateAnswer=(req,res)=>{
    var ans= req.body.answer;
    
    Answer.findByIdAndUpdate(req.answer._id,{answer:ans},function(err,answer){
    if(err){
        console.log(err);
        res.json({
            err:"error in updation"
        })
    }
    else{
        res.json({
            msg:"updated Successfully"
        });
    }
    
    })
    
    
    }

    exports.deleteAnswer=(req,res)=>{
     
        Answer.findById(req.answer._id).populate("question").exec(function(err,answer){
           if(err){
               console.log(err);
           }

           else{
               

               Array.prototype.remove = function() {
                var what, a = arguments, L = a.length, ax;
                while (L && this.length) {
                    what = a[--L];
                    while ((ax = this.indexOf(what)) !== -1) {
                        this.splice(ax, 1);
                    }
                }
                return this;
            };
                        
            answer.question[0].answers.remove(req.params.id);

            console.log(answer.question[0].answers);
        
          
            Question.findByIdAndUpdate({_id:answer.question[0]._id},{answers:answer.question[0].answers},function(err,res){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(res);
                }
            });
            Answer.findByIdAndRemove(req.answer._id, function(err){
                if (err) {
                    res.json({
                        err:"deletion error"
                    });
                } else {
                    res.json({
                        msg:"Deleted Successfully"
                    });
                }
            });
           }

        })
        
    }