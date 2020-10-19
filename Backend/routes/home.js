let express= require("express");
let router=express.Router();
let {createQuestion}=require("../controllers/home")


let {isSignedIn}=require("../controllers/auth")

router.post("/question",createQuestion);



module.exports= router;