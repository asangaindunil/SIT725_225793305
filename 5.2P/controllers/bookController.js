// Import the service
const bookService = require('../services/bookService');

// Controller uses the service to get data
exports.getAllBooks = (req, res) => {
  const items = bookService.getAllBooks();
  res.json({
    status: 200,
    data: items,
    message:'All books retrieved successfully'
  });
};

exports.getBookById = (req, res) => {
  const id = req.params.id;
  const item = bookService.getBookById(id);
  res.json({
    status: 200,
    data: item,
    message:'Book retrieved successfully'
  });
};