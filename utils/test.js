const informationUser = require("../model/informationUser");

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

exports.getDistanceFromLatLonInKm = function (data) {
  const { latitude, longitude } = data;
  var lat1 = latitude;
  var lon1 = longitude;
  var lat2 = 10.143921;
  var lon2 = 105.646316;
  var R = 6371e3; // Radius of the earth in m
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(1);
};
