var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    var myquery = { name: 'Trần Tấn Đạt' };
    var newvalues = {
        $set: {
            name: 'Phạm Mạnh Đình',
            age: 22,
            password: '123'
        }
    };
    dbo.collection("staff").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
    });
});