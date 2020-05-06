const Courses = require('../models/Courses');
const ErrorResponse = require('../util/errorResponse')
const AsyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Courses');


// @desc Get all courses
// @route GET /api/v1/courses
// @routes GET/api/v1/bootcamps/:bootcampId/courses
//@acess Public
exports.getCourses = AsyncHandler(async(req,res,next)=>{
  let query;
  if(req.params.bootcampId){
    query = Courses.find({bootcamp:req.params.bootcampId});
  }else{
    query = Courses.find().populate({
      path:'bootcamp',
      select:'name description'
    });
    //console.log('yo');
  }
const course = await query;
res.status(200).json({
  sucess:true,
  //count:course.length,
  data:course
});
});

// @desc Get single courses
// @route GET /api/v1/courses/:id
//@acess Public
exports.getCourse = AsyncHandler(async(req,res,next)=>{

const course = await Courses.findById(req.params.id).populate({
  path:'bootcamp',
  select:'name description'
});
if(!course){
  return next(new ErrorResponse('Please enter a valid id'),404);
}
res.status(200).json({
  sucess:true,
  //count:course.length,
  data:course
  });
});

// @desc Add a courses
// @route Post /api/v1/bootcamp/:bootcampId/courses
//@acess Public
exports.addCourse = AsyncHandler(async(req,res,next)=>{

  req.body.bootcamp = req.params.bootcampId;

const bootcamp = await Bootcamp.findById(req.params.bootcampId);
if(!bootcamp){
  return next(new ErrorResponse('Please enter a valid id'),404);
}
const course = await Course.create(req.body);
res.status(200).json({
  sucess:true,
  //count:course.length,
  data:course
  });
});
