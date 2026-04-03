var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/sit725-invertory-db');
mongoose.connection.on('connected', () => {
console.log('Connected to MongoDB!');
});

// create schema
const inventorySchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String
});

const Inventory = mongoose.model('Inventory', inventorySchema);

const bookInventoryList = [
    {
        name: "The Lord of the Rings",
        description: "A classic book by J.R.R. Tolkien",
        price: 19.99,
        quantity: 10,
        image: "images/lotr.jpg"
    },
    {
        name: "Harry Potter and the Sorcerer's Stone",
        description: "A classic book by J.K. Rowling",
        price: 14.99,
        quantity: 5,
        image: "images/hp.jpg"
    },
    {
        name: "The Catcher in the Rye",
        description: "A classic book by J.D. Salinger",
        price: 12.99,
        quantity: 8,
        image: "images/cir.jpg"
    }
];

//delete already inserted data
Inventory.deleteMany({})
    .then(() => {
        console.log("Inventory deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting inventory:", error);
    });

//insert seed data
Inventory.insertMany(bookInventoryList)
    .then(() => {
        console.log("Inventory seeded successfully");
    })
    .catch((error) => {
        console.error("Error seeding inventory:", error);
    });

    

app.get("/api/inventory", async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


var port = process.env.port || 3000;
app.listen(port, () => {
  console.log("App listening to: " + port);
});
