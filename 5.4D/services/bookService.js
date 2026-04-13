const Book = require('../models/bookModel');

// Get all books
const getAllBooks = async () => {
  return await Book.find({});
};

// Get book by custom id
const getBookById = async (id) => {
  return await Book.findOne({ id: id });
};

// Create book
const createBook = async (book) => {
  return await Book.create(book); //create always run auto validation
};

// Update book by custom id
const updateBookById = async (id, book) => {
  return await Book.findOneAndUpdate(
    { id: id }, 
    book, 
    {
      new: true,           // return updated document
      runValidators: true, // IMPORTANT: enforce schema validation
      strict: "throw"      // reject unknown fields
    }
  );
};

// Delete book
const deleteBookById = async (id) => {
  return await Book.findOneAndDelete({ id: id });
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById
};