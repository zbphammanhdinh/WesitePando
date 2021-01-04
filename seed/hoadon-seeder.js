var Hoadon = require('../models/hoadon');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://dinhpham:<11223344>@cluster0.skmed.mongodb.net/<CNPMM>?retryWrites=true&w=majority"; // connect online

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/shopping');

var hoadon = [
    new Hoadon({
        ID: 'hd01',
        idcard: 'card01',
        time: '12/04/2018',
        price: '100000',
        idkh: 'kh01',
    }),
];

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("CNPMM");
    for (var i = 0; i < hoadon.length; i++)
        dbo.collection("hoadon").insertOne(hoadon[i], function(err, res) {
            if (err) throw err;
        });
    db.close();
    console.log("document inserted");
});