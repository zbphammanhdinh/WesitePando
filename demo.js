var express = require('express');
var sessions = require('express-session');
var url = require('url');
var app = express();
var cookieParser = require('cookie-parser')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const PORT = process.env.PORT || 8080;
//const PORT =
var session;

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://dinhpham:<11223344>@cluster0.skmed.mongodb.net/<CNPMM>?retryWrites=true&w=majority"; // connect online

console.log(PORT);

var app = require('express')();
var server = require('http').Server(app);


server.listen(PORT);
var connection;


app.use(sessions({
    secret: '(!)*#(!JE)WJEqw09ej12',
    resave: false,
    saveUninitialized: true
}));

var path = require('path');
const dirname = __dirname;
module.exports = {
    dirname: dirname
}
app.use(express.static(path.join(__dirname, 'Data')));

var Passport = require("./models/Passport");
var LocalStrategy = require("passport-local").Strategy;
app.use(Passport.initialize());
app.use(Passport.session())

// Language
var i18n = require("i18n");
app.use(cookieParser())
app.use(i18n.init);

i18n.configure({
    locales: ['en', 'vi'],
    directory: __dirname + '/locales',
    cookie: 'lang',
});

app.use('/change-lang/:lang', (req, res) => {
    res.cookie('lang', req.params.lang, { maxAge: 900000 });
    res.redirect('back');
});

////

app.set("view engine", "ejs");
app.set("views", "./views")
app.set("view options", { layout: "layout" });

var indexRouter = require('./routes/indexRouter.js');
var adminRouter = require('./routes/adminRouter.js');
var emailRouter = require('./routes/emailRouter.js');
var loginRouter = require('./routes/loginRouter.js');
var customerRouter = require('./routes/customerRouter.js');
var productRouter = require('./routes/productRouter.js');
var cartAndPaymentRouter = require('./routes/cartAndPaymentRouter.js');
var customerManager = require('./routes/admin/customerManager');
var thongKe = require('./routes/admin/thongkeRouter');
var productManager = require('./routes/admin/productManager');
var hoadonManager = require('./routes/admin/hoadonManager');

var Language = require('./routes/Language.js');
app.use(hoadonManager);
app.use(customerRouter);
app.use(indexRouter);
app.use(adminRouter);
app.use(emailRouter);
app.use(loginRouter);
app.use(productRouter);
app.use(cartAndPaymentRouter);
app.use(customerManager);
app.use(thongKe);
app.use(productManager);
// app.use(Language);

// Error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('errorPage', {
        error: err.message
    });
});


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"