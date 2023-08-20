var mysql = require('mysql2');
var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'kimhs5860',
    database : 'opentutorials'
});
db.connect();
module.exports = db;