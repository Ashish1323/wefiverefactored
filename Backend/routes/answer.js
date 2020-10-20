let express= require("express");
let router=express.Router();
let {createAnswer}=require("../controllers/answer")
let {getQuestionById}=require("../controllers/question")


let {isSignedIn}=require("../controllers/auth")
let {getUserById}=require("../controllers/user")




router.param("userId",getUserById);
router.param("questionId",getQuestionById);

router.post("/answer/:userId/:questionId",isSignedIn,createAnswer);



module.exports= router;