const mongoose = require('mongoose');

/*
id (string)
title (string)
author (string)
year (number)
genre (string)
summary (string)
price (Decimal128)
*/

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, "Book id is required"],
        unique: true,
        index: true,
        trim: true,
        minlength: [2, "Id must be at least 2 characters"],
        maxlength: [20, "Id cannot exceed 20 characters"]
    },

    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },

    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
        minlength: [3, "Author must be at least 3 characters"],
        maxlength: [50, "Author cannot exceed 50 characters"]
    },

    year: {
        type: Number,
        required: [true, "Year is required"],
        min: [1800, "Year cannot be before 1800"],
        max: [currentYear, "Year cannot be in the future"],
        get: v => v?.toString()
    },

    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: [true, "Price is required"],
        validate: {
            validator: function(v) {
                return parseFloat(v.toString()) >= 0.01;
            },
            message: "Price must be greater than 0"
        },
        get: v => v ? v.toString() : v
    },
    currency: {
        type: String,
        required: true,
        default: 'AUD',
        enum: ['AUD' , 'USD', 'EUR']
    },

    genre: {
        type: String,
        required: [true, "Genre is required"],
        trim: true,
        minlength: [3, "Genre must be at least 3 characters"],
        maxlength: [30, "Genre cannot exceed 30 characters"]
    },

    summary: {
        type: String,
        trim: true,
        maxlength: [500, "Summary cannot exceed 500 characters"]
    }

},
{
    strict: "throw", 
    toJSON: {
        getters: true,
        virtuals: false,
        transform(_doc, ret) {
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        getters: true,
        virtuals: false
    }
});

module.exports = mongoose.model('Book', bookSchema);