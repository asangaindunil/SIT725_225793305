const mongoose = require('mongoose');

/*
id (string)
title (string)
author (string)
year (number)
genre (string)
summary (string)
*/

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        get: v => v?.toString()
    },
    //price decimal128
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        get: v => v ? v.toString() : v
    },
    currency: { type: String, required: true, default: 'AUD' },
    genre: String,
    summary: String
},
{
  toJSON:   { getters: true, virtuals: false, transform(_doc, ret){ delete ret.__v; return ret; } },
  toObject: { getters: true, virtuals: false }
}
);

module.exports = mongoose.model('Book', bookSchema);