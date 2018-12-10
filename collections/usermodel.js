const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');

//creating Schema
const UserSchema = new Schema({
  first_name: {type: String, required: true},
  email: {type: mongoose.SchemaTypes.Email, required: true},
  user_name: {type: String, required: true},
  last_name: {type: String, required: true},
  password: {type: String, required: true},
  confirm_password: {type: String, required: true}
});

//exporting collections
module.exports = mongoose.model('User', UserSchema);
