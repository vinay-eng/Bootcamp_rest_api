const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path:'config/config.env'});


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:['true','Please add a no']
  },
  email:{
    type:String,
    required:[true,'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role:{
    type:String,
    enum:['user','publisher'],
    default:'user'
  },
  password:{
    type:String,
    required:[true,'Please add a password'],
    minLength: 6,
    select:false
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,
  createdAt:{
    type:Date,
    default:Date.now()
  }
});

userSchema.pre('save',async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);

});

// Sign Jwt and return
userSchema.methods.getSignedJwtToken = function(next){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
  });
};

// check password
userSchema.methods.checkPassword = async function(enterPassword){
  return await bcrypt.compare(enterPassword,this.password);
}

module.exports = mongoose.model('Users',userSchema);
