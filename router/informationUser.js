// const express = require("express");
const express = require("express");
const router = express.Router();
const utils = require("../utils/test");
const User = require("../model/User");
const informationUser = require("../model/informationUser");

router.post("/information", async (req, res) => {
  const {
    uniqueId,
    ipAddress,
    macAddress,
    deviceName,
    brand,
    buildId,
    deviceType,
    ssid,
    status,
    systemversion,
    date,
    time,
    longitude,
    latitude,
    userId,
  } = req.body;
  // console.log("Id của người đăng ký xuống:", userId);

  // const maccAdd = mac.macaddress;
  const user = await User.findOne({ userId });
  const uniID = user.uniqueId;
  const maccAdd = user.macAddress;

  console.log(" uniqueId login:", uniID);
  console.log(" macAddress login:", maccAdd);

  const idUser = user._id.toString();
  console.log(" _id login:", idUser);
  // console.log("user nhập xuống:", userId);
  const idDevices = await User.find({ uniqueId });
  console.log("id ở đăng ký", idDevices);
  // const devicesId = idDevices.uniqueId;
  // const macAdd = await User.findOne({ macAddress });
  // const mac = macAdd.macAddress;
  // console.log("macAdd ở đăng ký", mac);

  // const macc = macadd.macaddress;
  if (idUser === userId && uniID === uniqueId && macAddress === maccAdd) {
    const locationData = { longitude, latitude };
    const distance = utils.getDistanceFromLatLonInKm(locationData);
    console.log("vị trí", distance);
    if (distance <= 500) {
      //Nếu khoảng cách bé hơn hoặc bằng 500 -> chèn thông tin vào mongo
      //Tạo ra thông tin cần đưa vào mongo
      const insertInfomation = new informationUser({
        uniqueId,
        ipAddress,
        macAddress,
        deviceName,
        brand,
        buildId,
        deviceType,
        ssid,
        status,
        systemversion,
        date,
        time,
        longitude,
        latitude,
        userId,
      });
      const saveData = await insertInfomation.save();
      //Nếu save data có giá trị -> insert thành công
      if (saveData) {
        console.log("lưu thành công", saveData);
        //Thành công
        return res.json({
          status: true,
          notification: "Thao Tác Thành Công",
          data: saveData,
        });
      }
    } else {
      return res.json({
        status: false,
        notification: "Bạn Đang Ở Ngoài Khu Vực Chấm Công",
      });
    }
  } else {
    res.json({
      status: false,
      notification: "Bạn Đang Sử Dụng Sai Thiết Bị",
    });
  }
});

router.post("/checkout", async (req, res) => {
  const { userId, date } = req.body;
  console.log("userid check out:", userId);
  console.log("date check out:", date);

  const user = await informationUser
    .findOne({ userId, date, status: "1" })
    .then((respnse) => {
      console.log("check out", respnse);
      if (respnse) {
        return res.json({
          status: 1,
          mess: "Success",
          data: {
            checkOut: true,
          },
        });
      }
      if (respnse === null) {
        return res.json({
          status: 1,
          mess: "fail",
          data: {
            checkOut: false,
          },
        });
      }
    });
});
router.post("/checkin", async (req, res) => {
  const { userId, date } = req.body;
  console.log("userid check in:", userId);
  console.log("date check in:", date);
  const checkin = await informationUser
    .findOne({ userId, date, status: "0" })
    .then((respnse) => {
      console.log("check in", respnse);

      if (respnse) {
        return res.json({
          status: 1,
          mess: "Success",
          data: {
            check: true,
          },
        });
      }
      if (respnse === null) {
        return res.json({
          status: 1,
          mess: "Fail",
          data: {
            check: false,
          },
        });
      }
    });
});

router.post("/getTime", async (req, res) => {
  const { data, uerId } = req.body;
  const timeCheck = await informationUser.find({
    data: /date/,
    uerId,
  });
  console.log(timeCheck);
  let obj = {};
  timeCheck.map((item) => {
    obj = {
      ...obj,
      [item.date]: [...(obj[item.date] || []), item],
    };
  });
  if (obj)
    return res.json({
      message: "hello",
      data: obj,
    });
});
module.exports = router;
