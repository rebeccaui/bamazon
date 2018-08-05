//-----------------------------//
//      Bamazon Customer       //
//-----------------------------//

//=========================//
// Connect to the database
//=========================//
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "GreenTeaLatte72012",
    database: "bamazon"
});

//If the connection is successful, 
//initiate the Bamazon Customer Service Program
connection.connect(function(err) {
    if (err) throw err;
    customerGreeting();
});
//connection.end();

//Customer is greeted on the Node command line and must select a dept
//reuslting function uses a switch case to display the items in each dept
function customerGreeting() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "=====================================================" +
                "\nWelcome to Becky, Bath, and Beyond!" +
                "\nWhat can I assist you with?" +
                "\n" +
                "\nPlease select a department to see our latest products!" +
                "\n",
        choices: ["clothing", "furniture", "electronics", "all"]
    }).then(function(answer) {
        console.log("This way, please.");
        console.log("=====================================================");
        switch (answer.menu) {
            case "all":
                displayAllItems();
                break;

            case "clothing":
                displayDepartment();
                break;

            case "furniture":
                displayDepartment();
                break;

            case "electronics":
                displayDepartment();
                break;
        }
        function displayDepartment() {
            connection.query("SELECT * FROM bamazon.products WHERE department_name = '" + answer.menu + "'", function(err, results) {
                if (!err) {
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i].item_id, results[i].product_name, results[i].price);
                        if (results.length - 1 === i) {
                            customerPurchase();
                        }
                    }
                }
            });              
        }
    });
}

//========================//
// Item Display Functions
//========================//
function displayAllItems() {
    console.log("Here are the items you asked for.");
    connection.query("SELECT * FROM bamazon.products;", function(err, results) {
                if (!err) {
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i].item_id, results[i].product_name, results[i].price);
                    }
                    customerPurchase();
                }
            });
}

//============================================================//
// Prompt Functions - Purchasing, Confirmations, Out of Stock
//============================================================//

function customerPurchase() {
    inquirer.prompt({
        name: "purchaseBool",
        type: "confirm",
        message: "Would you like to purchase an item from this department?"
    }).then(function(answer) {
        if (answer.purchaseBool === true) {
            console.log("=====================================================");
            console.log("Excellent!");
            customerPurchaseById();
        } else {
            console.log("No problem! We will pick a new department!");
            customerGreeting();
        }
    });
}

//Customer wants to make a purchase; They must input the product name and a quantity
function customerPurchaseById() {
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "Type in the name of any product you wish to purchase: "
            }, {
                name: "quantity",
                type: "input",
                message: "How many of these would you like to purchase? "
            }]
        ).then(function(answer) {
            for (i=0; i < res.length; i++) {
                if (answer.item === res[i].product_name && answer.quantity <= res[i].stock_quantity) {
                    updatedStock = res[i].stock_quantity - answer.quantity;
                        //Show Price
                        console.log("Your total will be " + answer.quantity * res[i].price);
                        console.log("Thank you for your purchase.");
                    //Update the MySQL Database
                    connection.query("UPDATE products SET ? WHERE ? ", [
                        {
                            stock_quantity: updatedStock
                        },
                        {
                            product_name: answer.item
                        }
                    ], function(err) {
                        if(!err) {
                            customerPurchaseAgain();
                        }
                    });
                } 
                else if (answer.item === res[i].product_name && answer.quantity > res[i].stock_quantity) {
                    console.log("I'm sorry, we have " + res[i].stock_quantity + " left of that product.");
                    customerPurchaseAgain();
                } 
                else if (res.length === i) {
                    console.log("Sorry, I didn't catch that. Please try again.");
                    customerPurchaseById();
                }
            }
        });
    });
}

//Prompt after purchasing an item or if that item doesn't have enough stock
function customerPurchaseAgain() {
        inquirer.prompt(
            {
                name: "again",
                type: "confirm",
                message: "Would you like to purchase any other items today?"
            }
        ).then(function(answer) {
            if (answer.again === true) {
                console.log("Great!");
                customerGreeting();
            } else {
                console.log("Thank you for shopping with us." +
                            "Click Ctrl+C to exit the store.");
            }
        }); 
}
