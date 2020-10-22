let express= require("express");
let router=express.Router();
let {createQuestion,deleteQuestion,getQuestionById}=require("../controllers/question")


let {isSignedIn}=require("../controllers/auth")
let {getUserById}=require("../controllers/user")




router.param("userId",getUserById);
router.param("questionId",getQuestionById);

router.post("/question/:userId",isSignedIn,createQuestion);
router.post("/question/delete/:questionId",deleteQuestion)


module.exports= router;