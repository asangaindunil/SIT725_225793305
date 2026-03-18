var express = require("express")
var app = express()
var port = process.env.port || 3000;
const path = require('path');
app.listen(port,()=>{
console.log("App listening to: " + port)
})

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));


//get API for add 2 numbers
app.get("/add/:num1/:num2", (req, res) => {
    var num1 = parseInt(req.params.num1);
    var num2 = parseInt(req.params.num2);
    var result = num1 + num2;
    res.json({ result: result });
});

//post API for all calculator operations, json input allow 
app.post("/calculate", (req, res) => {
    var operation = req.body.operation;
    var num1 = parseInt(req.body.num1);
    var num2 = parseInt(req.body.num2);
    var result;
    if (operation === "+") {
        result = num1 + num2;
    } else if (operation === "-") {
        result = num1 - num2;
    } else if (operation === "*") {
        result = num1 * num2;
    } else if (operation === "/") {
        result = num1 / num2;
    } else {
        result = "Invalid operation";
    }
    res.json({ result: result });
});
