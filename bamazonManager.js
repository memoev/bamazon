var inquirer = require('inquirer');
var mysql = require('mysql');

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
        console.log(res);
    });