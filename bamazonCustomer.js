var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "FabiolaV22!",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            // console.log(res);
            for (i = 0; i < res.length; i++) {
                console.log(res[i].product_name);
            }
            connection.end();
        });           
}