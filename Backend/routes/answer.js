let express= require("express");
let router=express.Router();
let {createAnswer,updateAnswer,deleteAnswer}=require("../controllers/answer")
let {getQuestionById}=require("../controllers/question")
let {getAnswerById}=require("../controllers/answer")


let {isSignedIn}=require("../controllers/auth")
let {getUserById}=require("../controllers/user")




router.param("userId",getUserById);
router.param("questionId",getQuestionById);
router.param("answerId",getAnswerById);

router.post("/answer/:userId/:questionId",isSignedIn,createAnswer);
router.post("/edit/answer/:userId/:answerId",isSignedIn,updateAnswer);
router.post("/delete/answer/:userId/:answerId",isSignedIn,deleteAnswer);



module.exports= router;