var inquirer = require('inquirer');
var mysql = require('mysql');
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

run();

function run() {
    console.log('\x1b[35m', 'Welcome to the BaManager User Interface!', '\x1b[37m');
    console.log('\x1b[33m', "Press Control + C to exit the application", '\x1b[37m')
    inquirer
        .prompt([
            {
                type: "list",
                message: "What now?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ],
                name: "choice"
            }
        ]).then(function (res) {
            console.log(res.choice);
            switch (res.choice) {
                case "View Products for Sale":
                    return productsForSale();
                case "View Low Inventory":
                    return viewLowInv();
                case "Add to Inventory":
                    return addToInv();
                case "Add New Product":
                    return addNewProduct();
            }
        });
}

function productsForSale() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            var headers = ["ID", "Item", "Item Department", "Price", "Stock"]
            var data = [];
            data.push(headers);
            if (err) throw err;
            // console.log(res);
            for (i = 0; i < res.length; i++) {
                const row = [];
                row.push(res[i].item_id);
                row.push(res[i].product_name);
                row.push(res[i].department_name);
                row.push(res[i].price);
                row.push(res[i].stock_quantity);

                data.push(row);
            }

            var config;
            var output;

            output = table(data, config);

            console.log(output);
            run();
        });
}

function viewLowInv() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 50",
        function (err, res) {
            var headers = ["ID", "Item", "Item Department", "Price", "Stock"]
            var data = [];
            data.push(headers);
            if (err) throw err;
            // console.log(res);
            for (i = 0; i < res.length; i++) {
                const row = [];
                row.push(res[i].item_id);
                row.push(res[i].product_name);
                row.push(res[i].department_name);
                row.push(res[i].price);
                row.push(res[i].stock_quantity);

                data.push(row);
            }

            var config;
            var output;

            output = table(data, config);

            console.log(output);
            run();
    });
}

function addToInv() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What's the ID of the product you want to add quantity to?",
                name: "productId"
            },
            {
                type: "input",
                message: "Quantity?",
                name: "productQty"
            }
        ]).then(function (res) {
            connection.query("SELECT * FROM products WHERE ?",
                [
                    {
                        item_id: res.productId
                    }
                ],
                function (err, response) {
                    if (err) throw err;
                    var newStock = response[0].stock_quantity + parseInt(res.productQty);
                    
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: res.productId
                            }
                        ],
                        function (err, response) {
                            if (err) throw err;
                            //console.log(res);
                            // for (i = 0; i < response.length; i++) {
                            //     console.log(response[i]);
                            // }

                            console.log('\x1b[33m', "\nQuantity for item " + res.productId + " is now " + newStock + "\n", '\x1b[37m');
                            run();
                        });
                    
                });
        });
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What product you want to add?",
                name: "productName"
            },
            {
                type: "input",
                message: "What's the product department?",
                name: "productDepa"
            },
            {
                type: "input",
                message: "What's the price?",
                name: "productPrice"
            },
            {
                type: "input",
                message: "Initial Stock Qty?",
                name: "productInitQ"
            }
        ]).then(function (res) {
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)",
                [res.productName, res.productDepa, res.productPrice, res.productInitQ],
                function (err, response) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('\x1b[33m', "Product has been added!\n", '\x1b[37m');
                    }
                    //console.log(res);
                    // for (i = 0; i < response.length; i++) {
                    //     console.log(response[i]);
                    // }

                    run();
                }); 
    });
}