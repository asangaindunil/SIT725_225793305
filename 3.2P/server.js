var express = require("express");
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var port = process.env.port || 3000;

/*
GET Endpoint
Example:
http://localhost:3000/api/calc?num1=10&num2=5&operation=add
*/

app.get("/api/calculator", (req, res) => {

    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    const operation = req.query.operation;

    let result;

    if (isNaN(num1) || isNaN(num2)) {
        return res.json({
            status: "error",
            message: "Invalid numbers"
        });
    }

    switch(operation) {
        case "add":
            result = num1 + num2;
            break;

        case "sub":
            result = num1 - num2;
            break;

        case "mul":
            result = num1 * num2;
            break;

        case "div":
            result = num1 / num2;
            break;

        default:
            return res.json({
                status: "error",
                message: "Invalid operation"
            });
    }

    res.json({
        status: "success",
        num1,
        num2,
        operation,
        result
    });

});


app.listen(port, () => {
  console.log("App listening to: " + port);
});
