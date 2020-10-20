
let express= require("express");
let router=express.Router();

const User = require("../models/user")
let {getUserById}=require("../controllers/user")


router.param("userId",getUserById);

module.exports = router