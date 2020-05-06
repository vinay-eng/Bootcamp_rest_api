const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connect = require('./config/db');
const errorHandler = require('./middleware/error');
const colors = require('colors');
const cookieParser = require('cookie-parser');
// const authMiddleware = require('./middleware/auth');


// const bodyParser = require('bodyParser');
const app = express();
const bootcamp = require('./Routes/bootcamp');  //Routes variable
const courses = require('./Routes/courses');
const auth = require('./Routes/auth');

//Load env file
dotenv.config({path:'config/config.env'});

// body Parser
app.use(express.json());

// cookie parse
app.use(cookieParser());

//Routes
app.use('/api/v1/bootcamps',bootcamp);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);


app.use(errorHandler);

// connecting database
connect();

//middleware login
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

const PORT = process.env.PORT;
const server = app.listen(PORT,console.log(`Server is running on ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold));

process.on('unhandledRejection',(err,promise)=>{
  console.log(`Error : ${err.message}`.red.bold);
  //Close Server and exit
  server.close(()=>{
    process.exit(1);
  });
});
