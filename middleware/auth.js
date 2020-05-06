const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ErrorResponse = require('../util/errorResponse');
const AsyncHandler = require('./async');

// protect
exports.protect = AsyncHandler(async (req,res,next)=>{
  let token;

  if(req.headers.authorization &&req.headers.authorization.startWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  // else if(req.cookies.token){
  //   token = req.cookies.token
  // }

  // make sure token exists
  if(!token){
    return new ErrorResponse('Not authorized to acess this route',404);
  }
  try {
    // verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log(decoded);
     req.user = await Users.findById(decoded.id);
     next();
  } catch (e) {
    return new ErrorResponse('Not authorized to acess this route',404);
  }
});
