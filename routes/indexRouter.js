var express = require("express"),
    router = express.Router(),
    Passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy
var nodemailer = require("nodemailer");
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://dinhpham:<11223344>@cluster0.skmed.mongodb.net/<CNPMM>?retryWrites=true&w=majority"; // connect online

var typeproduct = require("../models/typeproduct"); ///// menu
var crypto = require('crypto-js');

var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'nguyenthanhdai261097@gmail.com',
        pass: 'thanhdai123'
    }
});
//asdasd/
// default direct for css and html bug not load
var directName = require('../demo');
router.use(express.static(directName.dirname + '/Data'));
//

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

function isLoggedin(req, res, next) {
    if (req.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}
//  Routes in Index
router.get('/', function(req, res) {
    if (req.user == null) {} else if (req.user.ID[0] == "s") {
        console.log("admin: " + req.user.name);
        req.logout();
        req.user = null;
    }
    typeproduct.typeproductCollection(function(kq) {
        console.log("index in router");
        res.render('index', {
            user: req.user,
            typeproduct: kq,
            body: 'product/index.ejs'
        });
    });
});


router.get('/me', function(req, res) {
    res.render("Aboutme");
});



// sign-up


router.get("/signup", function(req, res) {
    typeproduct.typeproductCollection(function(kq) {
        res.render("index", {
            user: req.user,
            error: "true",
            body: 'customer/signup.ejs',
            typeproduct: kq
        });
    });
});


router.get('/logout', function(req, res) { // ham index de vao web chinh
    req.logout();
    user = null;
    typeproduct.typeproductCollection(function(kq) {
        console.log("index in router");
        res.render('index', {
            user: user,
            typeproduct: kq,
            body: 'product/index.ejs'
        });
    });
});

// chổ cần sửa.
router.post('/signup', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    var diachi = req.body.diachi;
    var email = req.body.email;
    var phone = req.body.phone;
    var hoten = firstname + " " + lastname;
    var check = true;
    var customer = require('../models/customer');
    console.log('pass1:' + password);
    var pass;
    pass = crypto.AES.encrypt(password, 'dudada').toString();
    password = pass;
    pass = null;
    console.log('pass2:' + password);

    customer.customerCollection(function(customer) {

        for (var i = 0; i < customer.length; i++) { //  check email da dang ki
            if (customer[i].ID == username || customer[i].email == email) {
                check = false;
            }
        }
        if (check == true) {

            MongoClient.connect(uri, function(err, db) {
                //var ids = "/"+nameProduct+"/";
                if (err) throw err;
                var dbo = db.db("CNPMM");
                dbo.collection("customer").insert({
                    ID: username,
                    hoten: hoten,
                    password: password,
                    diachi: diachi,
                    email: email,
                    dienthoai: phone,
                    verify: 0
                });
            });
            var link = "http://dudadawebshop.herokuapp.com/verify?ID=" + username;
            var sendMail = require("../models/email.js");

            var sendMail = new sendMail();
            sendMail.verifyMail(email, link);


            transporter.sendMail(sendMail.mail, function(err, info) {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    console.log('verifyMail sent: ' + info.response);
                    res.redirect('/login');
                }
            });
        } else {
            res.redirect('/signupFail');
        }
    });



});

router.get('/signupFail', function(req, res) {
    typeproduct.typeproductCollection(function(kq) {
        res.render("index", {
            user: req.user,
            error: "Username hoặc email đã được đăng kí",
            body: 'customer/signup.ejs',
            typeproduct: kq
        });
    });
});


router.post("/fileupload", function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function(err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });

    });

})
router.get('/upload', function(req, res) {
    res.render('upload');
})


router.get('/fb', function(req, res) {
    res.render('facebook');
    console.log(res.name);
})


module.exports = router;