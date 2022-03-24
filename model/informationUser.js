const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  uniqueId: String,
  ipAddress: String,
  macAddress: String,
  deviceName: String,
  brand: String,
  buildId: String,
  deviceType: String,
  ssid: String,
  status: String,
  systemversion: String,
  date: String,
  time: String,
  longitude: String,
  latitude: String,
  userId: String,
});
const informationUser = mongoose.model("informationUser", UserSchema);

module.exports = informationUser;
