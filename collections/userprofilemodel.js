const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');

//creating Schema
const UserProfileSchema = new Schema({
  user_id: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin_code: { type: Number, required: true },
  phone_no: { type: Number, required: true }
});


UserProfileSchema.methods.getToken = function (result) {
  const token = md5(result._id);
  this.user_id = result._id
  return token;
}


//exporting collections
module.exports = mongoose.model('userProfile', UserProfileSchema);
