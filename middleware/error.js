const ErrorResponse = require('../util/errorResponse');

const errorHandler = (err,req,res,next)=>{
  let error = {...err}  //Putting all the properties of err int variable error
error.message = err.message;

  console.log(err.stack.red);

// Monngoose bad objectId
if(err.name === 'CastError'){
  const message =   `Bootcamp not found with id ${err.value}`;
  error = new ErrorResponse(message,404);
}
//Mongoose duplicate name
if(err.code === 11000){
  const message = 'Duplicate field';
  error = new ErrorResponse(message,404);
}

// validation errors
if(err.name === 'ValidationError'){
  const message = Object.values(err.errors).map(val=>val.message);
  error = new ErrorResponse(message,404);
}

  res.status(error.statusCode || 500).json({
    sucess:false,
    error:error.message || 'Server error'
  });
};

module.exports = errorHandler;
