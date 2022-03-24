const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  // fistname: String,
  // course: String,
  // username: String,
  // password: String,
  course: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  macAddress: { type: String, required: true, unique: true },
  uniqueId: { type: String, required: true, unique: true },
});
const User = mongoose.model("User", UserSchema);
//test
// User.create = function (data, result) {};
module.exports = User;
