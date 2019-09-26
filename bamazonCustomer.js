var mysql = require("mysql");
var inquirer = require('inquirer');
const { table } = require('table');

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
    // console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            var headers = ["ID", "Item", "Item Department", "Price", "Stock"]
            var data = [];
            data.push(headers);
            if (err) throw err;
            // console.log(res);
            console.log("\x1b[33m", 'Welcome to Bamazon!', '\x1b[37m');
            for (i = 0; i < res.length; i++) {
                const row = [];
                row.push(res[i].item_id);
                row.push(res[i].product_name);
                row.push(res[i].department_name);
                row.push(res[i].price);
                row.push(res[i].stock_quantity);

                data.push(row);
            }
            //connection.end();
            var config;
            var output;
            
            output = table(data, config);
            
            console.log(output);

            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What's the ID of the product you want to buy?",
                        name: "productId"
                    },
                    {
                        type: "input",
                        message: "How many units?",
                        name: "productQty"
                    }
                ]).then(function (res) {
                    connection.query("SELECT * FROM products WHERE ?",
                        [
                            {
                                item_id: res.productId
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            // console.log(res);
                            for (i = 0; i < res.length; i++) {
                                console.log(res[i]);
                            }
                            connection.end();
                        });
                });
        });           
}