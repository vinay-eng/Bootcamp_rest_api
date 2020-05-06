const Users = require('../models/user');
const ErrorResponse = require('../util/errorResponse');
const AsyncHandler = require('../middleware/async');

// @desc Register user
// @route GET /api/v1/auth/register
//@acess Public
exports.register = AsyncHandler(async(req,res,next)=>{
  const {name,email,password,role} = req.body;

  // create user
  const user = await Users.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(user,200,res);

});

// @desc Login User
// @route GET /api/v1/auth/login
//@acess Public
exports.login = AsyncHandler(async(req,res,next)=>{
  const {email,password} = req.body;

  // validate email and password
  if(!email || !password){
    return new ErrorResponse('please add email and password',404)
  }

  // check for user
  const user = await Users.findOne({email}).select('+password');
  if(!user){
    return new ErrorResponse('please add valid email',401)
  }

  // check password
  const isMatch = await user.checkPassword(password);
  if(!isMatch){
    return new ErrorResponse('please password',401)
  }

  sendTokenResponse(user,200,res);
});

// get token from model
const sendTokenResponse = (user,statusCode,res)=>{
  // create token
  const token = user.getSignedJwtToken();
  const option = {
    expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
    httpOnly:true
  };
  if(process.env.NODE_ENV === 'production'){
    option.secure = true;
  }
  res.status(statusCode).cookie('token',token,option)
    .json({
      sucess:true,
      token
    });
}
