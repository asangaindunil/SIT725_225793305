// Import the service
const bookService = require('../services/bookService');

// Controller uses the service to get data
exports.getAllBooks = async(req, res) => {
  const items = await bookService.getAllBooks();
  console.log(items);
  res.json({
    status: 200,
    data: items,
    message:'All books retrieved successfully'
  });
};

exports.getBookById = async(req, res) => {
  const id = req.params.id;
  const item = await bookService.getBookById(id);
  res.json({
    status: 200,
    data: item,
    message:'Book retrieved successfully'
  });
};