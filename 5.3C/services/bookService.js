const Book = require('../models/bookModel');

// Service function to get all book items
const getAllBooks = async() => {
  return await Book.find({});
};

const getBookById = async(id) => {
  return await Book.findById(id);
}
module.exports = {
  getAllBooks,
  getBookById
};
