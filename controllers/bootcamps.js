
const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../util/errorResponse');
const AsyncHandler = require('../middleware/async');
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
//@acess Public

exports.getBootCamps = AsyncHandler(async(req,res,next)=>{
  let query;
// creating remove field query
  const removeFields = ['select','sort','limit','page'];

  // coping req.query to reqQuery
  const reqQuery = {...req.query};

  // removing removeFields from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery); //converting query to json
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`); // converting in ge,lte format
  // using query to find data in db
  query = Bootcamp.find(JSON.parse(queryStr)).populate('Courses');

  // select fields
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  // sorting fields
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page,10)||1; //converting req.query.page to integer of base 10
  const limit = parseInt(req.query.limit,100)|| 10;
  const startIndex = (page-1)*limit;
  const endIndex = page*limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);


// executing query
  const bootcamp = await query;

  // pagination result
  const pagination = {}
  if(endIndex<total){
    pagination.next = {
      page :page+1,
      limit:limit
    }
  }
  if(startIndex>0){
    pagination.prev= {
      page:page-1,
      limit
    }
  }

  // sending data back to frontend
  res.status(200).json({sucess:true,pagination,data:bootcamp});
});

// @desc Get single bootcamps
// @route GET /api/v1/bootcamps/:id
//@acess Public

exports.getBootCamp = AsyncHandler(async (req,res,next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404));
    }
    res.status(200).json({sucess:true,data:bootcamp});
});

// @desc create vootcamps
// @route Post /api/v1/bootcamps
//@acess Private

exports.createBootCamp = AsyncHandler(async (req,res,next)=>{
  const bootcamp = await Bootcamp.create(req.body);
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404));
  }
  res.status(200).json({sucess:true,data:bootcamp});
});

// @desc Update bootcamps
// @route PUT /api/v1/bootcamps/:id
//@acess Private

exports.updateBootCamp = AsyncHandler(async (req,res,next)=>{
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  });
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404));
  }
  res.status(200).json({sucess:true,data:bootcamp});
});
// @desc Delete bootcamps
// @route Delete /api/v1/bootcamps/:id
//@acess Private

exports.deleteBootCamp = AsyncHandler(async(req,res,next)=>{
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404));
  }
  res.status(200).json({success:true})
});
