var express     = require("express")
var app=express()
var mongoose    = require("mongoose")

  

const { urlencoded } = require("body-parser");


var authRoutes=require("./routes/auth")


// DB Connection
mongoose.connect("mongodb://localhost:27017/Quora",{ useNewUrlParser: true } );

app.use("/api",authRoutes);

app.listen(8002)


