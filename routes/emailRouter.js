var express = require("express"),
    router = express.Router(),
    Passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    crypto = require('crypto-js')

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://dinhpham:<11223344>@cluster0.skmed.mongodb.net/<CNPMM>?retryWrites=true&w=majority"; // connect online

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({ // setting email for sender
    service: 'Gmail',
    auth: {
        user: '17110122@student.hcmute.edu.vn',
        pass: 'dinh123'
    }
});

var directName = require('../demo');
router.use(express.static(directName.dirname + '/Data'));

router.post('/email', function(req, res, next) {

    var pass;
    pass = crypto.AES.encrypt('ABCDE12345', 'dudada').toString();
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("CNPMM");
        dbo.collection("customer").update({
            email: req.body.email
        }, {
            $set: {
                password: pass
            }
        });
        db.close();
    });

    var Mail = require("../models/email.js");
    var sendMail = new Mail();
    sendMail.resetMail(req.body.email)

    transporter.sendMail(sendMail.mail, function(err, info) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
});


router.get('/verify?:ID', function(req, res) {
    var ID = req.query.ID;
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("3dwebsite");
        dbo.collection("customer").update({
            ID: ID
        }, {
            $set: {
                verify: 1
            }
        })
    })
    res.render('login/login', {
        error: "Tai khoan da kick hoat, vui long dang nhap lai"
    });
});
//asdasdasldkaslkdqwe
module.exports = router;