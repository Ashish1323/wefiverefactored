var express     = require("express")
let cookieParser=require("cookie-parser")
let cors=require("cors")
var app=express()
const bodyParser=require("body-parser")
var mongoose    = require("mongoose")

require('dotenv').config();

//my routes
var authRoutes=require("./routes/auth")
var questionRoutes=require("./routes/question")
var answerRoutes=require("./routes/answer")

  

const { urlencoded } = require("body-parser");


//middlewears
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//routes

app.use("/api",authRoutes);
app.use("/api",questionRoutes);
app.use("/api",answerRoutes);


// DB Connection
mongoose.connect("mongodb://localhost:27017/Quora_MERN",{ useNewUrlParser: true }).then(() => {
    console.log("DB Connected!!!")
    
}).catch((err) => {
    console.log(err);
})


app.listen(8002)


