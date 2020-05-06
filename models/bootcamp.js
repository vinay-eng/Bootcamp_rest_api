const mongoose = require('mongoose');
const slugify = require('slugify');
const Node_geocoder = require('../util/geocoder');

const BootcampSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Please add a name'],
    unique:true,
    trim:true,
    maxlength:[50,'Name can not be more than 50 charchter']
  },
  slug:String,
  description:{
    type:String,
    required:[true,'Please add a description'],
    unique:true,
    trim:true,
    maxlength:[500,'Description can not be more than 500 charchter']
  },
  website:{
    type:String,
    match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
  },
  phone:{
    type:String,
    maxlength:[50,'Name can not be more than 50 charchter']
  },
  email:{
    type:String,
    match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
  },
  address:{
    type:String,
    required:[true,'Plese add an address']
  },
  location:{
    type:{
      type:String,
      enum:['Point']
      // type:point,
      // coordinates : [loc[0].longitude,loc[0].latitude],
      // formattedAddress:loc[0].formattedAddress,
      // street:loc[0].streetName,
      // city:loc[0].city,
      // state:loc[0].statusCode,
      // zipcode:loc[0].zipcode,
      // country:loc[0].countryCode
    },
    coordinates:{
      type:[Number],
      index:'2dsphere'
    },
    formattedAddress:String,
    street:String,
    city:String,
    state:String,
    zipcode:String,
    country:String
  },
  careers:{
    type:[String],
    required:true,
    enum:[
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating:{
    type:Number,
    min:[1,'Rating must be at least 1'],
    max:[10,'Rating must can not more than 10']
  },
  averageCost:Number,
  photo:{
    type:String,
    default:'no-photo.jpg'
  },
  housing:{
    type:Boolean,
    default:false
  },
  jobGuarantee:{
    type:Boolean,
    default:false
  },
  acceptGi:{
    type:Boolean,
    default:false
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
}
,{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

// Create bootcamp slugify

BootcampSchema.pre('save',function(next){
  this.slug = slugify(this.name,{lower:true})
  next();
})

// // Geo coder
// BootcampSchema.pre('save',async function(next){
//   const loc = await Node_geocoder.geocode(this.address);
//   this.location = {
//     type:point,
//     coordinates : [loc[0].longitude,loc[0].latitude],
//     formattedAddress:loc[0].formattedAddress,
//     street:loc[0].streetName,
//     city:loc[0].city,
//     state:loc[0].statusCode,
//     zipcode:loc[0].zipcode,
//     country:loc[0].countryCode
//   };
//   // do not save address
//   this.address = undefined;
//
//   next();
// })

// reverse populate with virtuals
BootcampSchema.virtual('Course',{
  ref:'courses',
  localField:'_id',
  foreignField: 'bootcamp',
  justOne:false
})

module.exports = mongoose.model('bootcamp',BootcampSchema);
