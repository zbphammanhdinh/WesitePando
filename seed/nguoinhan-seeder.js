var Nguoinhan = require('../models/nguoinhan');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://dinhpham:<11223344>@cluster0.skmed.mongodb.net/<CNPMM>?retryWrites=true&w=majority"; // connect online

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/shopping');

var nguoinhan = [
    new Nguoinhan({
        IDhd: 'hd01',
        diachi: '373 Lý Thường Kiệt, Tân Bình, TP Hồ Chí Minh',
        dienthoai: '093942234',
        name: 'Trần Thị C',
    }),
];

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("CNPMM");
    for (var i = 0; i < nguoinhan.length; i++)
        dbo.collection("nguoinhan").insertOne(nguoinhan[i], function(err, res) {
            if (err) throw err;
        });
    db.close();
    console.log("document inserted");
});