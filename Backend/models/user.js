let mongoose= require("mongoose");
const crypto=require("crypto")
const uuidv1= require("uuid/v1")


var userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true
    },
  
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    encry_password:{
        type:String,
        required:true,
    },
    salt:String,
  
    userquestions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
         },
    ],
    useranswers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
         },
    ],
    image:{ type: String, default: "default.jpg"},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
},{timestamps:true})

userSchema.virtual("password")
    .set(function(password){
        this._password=password
        this.salt = uuidv1();
        this.encry_password= this.securePassword(password)
    })
    .get(function(){
        return this._password;
    })


userSchema.methods={

    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },

    securePassword:function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch (err){
            console.log(err);
            return "";
        }
    }
}

module.exports=mongoose.model("User", userSchema)
