const mongoose = require('mongoose');

const connectDB = async ()=>{
  const conn = await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindModify : false,
    useUnifiedTopology: true
  });
  console.log(`MongoDB is connected at host ${conn.connection.host}`.blue.bold);
};

module.exports = connectDB;
