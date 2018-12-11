const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating Schema
const UserProfileSchema = new Schema({
  user_id: String,
  dob: { type: String, required: true },
  mobile_no: { type: Number, required: true }
});



//exporting collections
module.exports = mongoose.model('userProfile', UserProfileSchema);
