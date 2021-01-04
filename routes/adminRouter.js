var express = require("express"),
  router = express.Router()

var staff = require('../models/staff'),
  customer = require('../models/customer')

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));



function isAdminLoggedin(req, res, next) {
  if (req.isAuthenticated() && req.user.ID[0] == 's') {
    return next();
  }
  res.redirect('/');
}


// default direct for css and html bug not load
var directName = require('../demo');

router.use(express.static(directName.dirname + './Data'));
//

var update;
router.post('/findProduct', function(req, res) {
  var idProduct = req.body.idProduct;

  product.findItemByID(idProduct, function(result) {
    if (result == "e" || result == null) {
      console.log("find Failed");
      res.redirect('findFailed');
    } else {
      console.log("findProduct" + result);
      update = result;
      res.redirect('findSuccess');
    }
  });
});

router.get('/findSuccess', function(req, res) {
  res.render('staff/updateProduct', {
    update: update,
    flag: true,
    error: ""
  });
});

router.get('/findFailed', function(req, res) {
  res.render('staff/updateProduct', {
    update: update,
    flag: false,
    error: "Không tìm thấy sản phẩm"
  });
});


router.post('/update', function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var link = req.body.link;
  var info = req.body.info;
  product.updateProductByID(update[0].ID, name, info, price, link);
  console.log("Update Success");
  res.redirect('updateSuccess')
  update = null;
});


router.get('/admin', isAdminLoggedin, function(req, res) { // ham index de vao web chinh
  console.log("admin login index: " + req.user);
  res.render('manage', {
    user: req.user,
    body: "staff/admin.ejs"
  });
});

router.get('/admin/logout', isAdminLoggedin, function(req, res) { // ham index de vao web chinh
  console.log("logout from admin");
  req.logout();
  req.user = null;
  res.redirect("/logout");
});

router.get('/logout', function(req, res) { // ham index de vao web chinh
  req.logout();
  user = null;
  typeproduct.typeproductCollection(function(kq) {
    res.render('index', {
      user: user,
      typeproduct: kq,
      body: 'product/index.ejs'
    });
  });
});

module.exports = router;
