var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://duy:vippergod12@data-imllf.mongodb.net/test"; // connect online


var someschema = new Schema({
  ID: String,
  time: String,
  total: Number,
  customer: [],
  dagiao: String,
  danhsachsanpham: []
});

function hoadonCount(callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().count(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      }
      else{
        callback(result);
      }
    });
    db.close();
  });
}

function hoadonCollection(callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        callback(result);
      }
    });
    db.close();
  });
}

function thongKe(danhsach, type) {
  var count = 0;
  var temp = danhsach.filter(x => x.item.type === type);
  for (var j = 0; j < temp.length; j++) {
    count = temp[j].quantity;
  }
  return count
}

function TongDoanhThu(callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var tongket = {
          giadung: 0,
          fashion: 0,
          mebe: 0,
          thucung: 0,
          xe: 0,
          dientu: 0,
        }
        for (var i = 0; i < result.length; i++) {
          var danhsach = result[i].danhsachsanpham;
          tongket["giadung"] += parseInt(thongKe(danhsach, "giadung"));
          tongket["fashion"] += parseInt(thongKe(danhsach, "fashion"));

          tongket["thucung"] += parseInt(thongKe(danhsach, "thucung"));
          tongket["xe"] += parseInt(thongKe(danhsach, "xe"));

          tongket["dientu"] += parseInt(thongKe(danhsach, "dientu"));
          tongket["mebe"] += parseInt(thongKe(danhsach, "mebe"));
        }
        var sum = 0;
        for (var each in tongket) {
          sum += tongket[each]
        }
        var result = {
          tongSP: sum,
          tongket: tongket
        }
        callback(result);
      }
    });
    db.close();
  });
}

var month = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

function DoanhThuThangInYear(year, callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var count = [];
        month.forEach(function(month) {
          var temp = result.filter(x => x.time.month === month && x.time.year == year);
          var x = 0;
          console.log("test: " + JSON.stringify(temp));
          for (var i = 0; i < temp.length; i++) {
            for (var each in temp[i].danhsachsanpham) {
              x += parseInt(temp[i].danhsachsanpham[each].quantity);
            }
          }
          var thang = {};
          thang[month] = x
          count.push(thang);
        });
        callback(count);
      }
    });
    db.close();
  });
}

function updateHoaDonByID(ID,dagiao) { // customer
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").update({
      ID: parseInt(ID)
    }, {
      $set: {
        dagiao: dagiao,
      }
    });
    db.close();
  });
}

function thongKeTheoNgay(str, callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var ngay = str[8]+str[9];
    var thang = str[5]+str[6];
    var nam = str[0]+str[1]+str[2]+str[3];

    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var tongket = {
          giadung: 0,
          fashion: 0,
          mebe: 0,
          thucung: 0,
          xe: 0,
          dientu: 0,
        }
        for (var i = 0; i < result.length; i++) {
          if(result[i].time.date == ngay && result[i].time.month == thang && result[i].time.year == nam){
            var danhsach = result[i].danhsachsanpham;
            tongket["giadung"] += parseInt(thongKe(danhsach, "giadung"));
            tongket["fashion"] += parseInt(thongKe(danhsach, "fashion"));

            tongket["thucung"] += parseInt(thongKe(danhsach, "thucung"));
            tongket["xe"] += parseInt(thongKe(danhsach, "xe"));

            tongket["dientu"] += parseInt(thongKe(danhsach, "dientu"));
            tongket["mebe"] += parseInt(thongKe(danhsach, "mebe"));
          }
        }
        var sum = 0;
        for (var each in tongket) {
          sum += tongket[each]
        }
        var result = {
          tongSP: sum,
          tongket: tongket
        }
        callback(result);
      }
    });
    db.close();
  });
}

function thongKeTheoThang(str, callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var ngay = str[8]+str[9];
    var thang = str[5]+str[6];
    var nam = str[0]+str[1]+str[2]+str[3];

    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var tongket = {
          giadung: 0,
          fashion: 0,
          mebe: 0,
          thucung: 0,
          xe: 0,
          dientu: 0,
        }
        for (var i = 0; i < result.length; i++) {
          if(result[i].time.month == thang && result[i].time.year == nam){
            var danhsach = result[i].danhsachsanpham;
            tongket["giadung"] += parseInt(thongKe(danhsach, "giadung"));
            tongket["fashion"] += parseInt(thongKe(danhsach, "fashion"));

            tongket["thucung"] += parseInt(thongKe(danhsach, "thucung"));
            tongket["xe"] += parseInt(thongKe(danhsach, "xe"));

            tongket["dientu"] += parseInt(thongKe(danhsach, "dientu"));
            tongket["mebe"] += parseInt(thongKe(danhsach, "mebe"));
          }
        }
        var sum = 0;
        for (var each in tongket) {
          sum += tongket[each]
        }
        var result = {
          tongSP: sum,
          tongket: tongket
        }
        callback(result);
      }
    });
    db.close();
  });
}

function thongKeTheoNam(str, callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var ngay = str[8]+str[9];
    var thang = str[5]+str[6];
    var nam = str[0]+str[1]+str[2]+str[3];

    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var tongket = {
          giadung: 0,
          fashion: 0,
          mebe: 0,
          thucung: 0,
          xe: 0,
          dientu: 0,
        }
        for (var i = 0; i < result.length; i++) {
          if(result[i].time.year == nam){
            var danhsach = result[i].danhsachsanpham;
            tongket["giadung"] += parseInt(thongKe(danhsach, "giadung"));
            tongket["fashion"] += parseInt(thongKe(danhsach, "fashion"));

            tongket["thucung"] += parseInt(thongKe(danhsach, "thucung"));
            tongket["xe"] += parseInt(thongKe(danhsach, "xe"));

            tongket["dientu"] += parseInt(thongKe(danhsach, "dientu"));
            tongket["mebe"] += parseInt(thongKe(danhsach, "mebe"));
          }
        }
        var sum = 0;
        for (var each in tongket) {
          sum += tongket[each]
        }
        var result = {
          tongSP: sum,
          tongket: tongket
        }
        callback(result);
      }
    });
    db.close();
  });
}


module.exports = mongoose.model('Hoadon', someschema);
module.exports.hoadonCollection = hoadonCollection;
module.exports.hoadonCount = hoadonCount;
module.exports.TongDoanhThu = TongDoanhThu;
module.exports.DoanhThuThangInYear = DoanhThuThangInYear;
module.exports.updateHoaDonByID = updateHoaDonByID;
module.exports.thongKeTheoNgay = thongKeTheoNgay;
module.exports.thongKeTheoThang = thongKeTheoThang;
module.exports.thongKeTheoNam = thongKeTheoNam;
