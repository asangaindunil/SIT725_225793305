// Import the service
const bookService = require('../services/bookService');

exports.getAllBooks = async (req, res) => {
  try {
    const items = await bookService.getAllBooks();

    res.status(200).json({
      data: items,
      message: 'All books retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await bookService.getBookById(id);

    if (!item) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.status(200).json({
      data: item,
      message: 'Book retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const item = await bookService.createBook(req.body);

    res.status(201).json({
      data: item,
      message: 'Book created successfully'
    });

  } catch (error) {

    // Duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate book id'
      });
    }

    // Validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);

      return res.status(400).json({
        message: errors.join(", ")
      });
    }

    // Cast error
    if (error.name === 'CastError') {
    return res.status(400).json({
      message: error.message
    });
  }

    // Unknown field (strict throw)
    if (error.name === 'StrictModeError') {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.updateBookById = async (req, res) => {
  try {
    const id = req.params.id;

    // Prevent ID update (immutability)
    if (req.body.id && req.body.id !== id) {
      return res.status(400).json({
        message: "Id cannot be modified"
      });
    }

    const item = await bookService.updateBookById(id, req.body);

    if (!item) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.status(200).json({
      data: item,
      message: 'Book updated successfully'
    });

  } catch (error) {

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);

      return res.status(400).json({
        message: errors.join(", ")
      });
    }
    
    if (error.name === 'CastError') {
    return res.status(400).json({
      message: error.message
    });
  }

    if (error.name === 'StrictModeError') {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.deleteBookById = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await bookService.deleteBookById(id);

    if (!item) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.status(200).json({
      data: item,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};