let express= require("express");
let router=express.Router();
let {createQuestion}=require("../controllers/question")


let {isSignedIn}=require("../controllers/auth")
let {getUserById}=require("../controllers/user")




router.param("userId",getUserById);

router.post("/question/:userId",isSignedIn,createQuestion);



module.exports= router;