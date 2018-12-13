const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');

//creating Schema
const UserProfileSchema = new Schema({
  user_id: { type: String },
  access_token: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pin_code: { type: Number },
  phone_no: { type: Number }
});


UserProfileSchema.methods.getToken = function (result) {
  const token = md5(result._id);
  this.user_id = result._id
  this.access_token = token
  return token;
}


//exporting collections
module.exports = mongoose.model('userProfile', UserProfileSchema);
