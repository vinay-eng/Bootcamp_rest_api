const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const color = require('colors')

// Load config.env
dotenv.config({path:'./config/config.env'});

//Load  models
const Bootcamp = require('./models/bootcamp');
const Course = require('./models/Courses');

// connect to db
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser : true,
  useCreateIndex : true,
  // useFindModify : false,
  useUnifiedTopology: true
})

// read json file
const bootcampData = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const courseData = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

// Import data
const import_data = async ()=>{
  try {
    await Bootcamp.create(bootcampData);
    await Course.create(courseData);
    console.log('data imported successfully'.green);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}
// delete data
const delete_data = async ()=>{
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('data deleted successfully'.red);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2] === '-i') {
  import_data();
}else if(process.argv[2] === '-d'){
  delete_data();
}
