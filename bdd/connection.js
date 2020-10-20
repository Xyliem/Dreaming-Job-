var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
	user:'root',
	password:'',
	database:'Web_Project'
});
connection.connect();

module.exports = connection;