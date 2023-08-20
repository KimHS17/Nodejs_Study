var mysql = require('mysql2');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'kimhs5860',
    database : 'opentutorials'
});

connection.connect();

connection.query('SELECT * FROM topic', function(error, results, fields) {
    if(error)
        console.log(error);
    console.log(results);
});

connection.end();