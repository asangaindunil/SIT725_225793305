
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/bookDB');

const book = require('../models/bookModel');
const bookItems = [
  {
    id: "b1",
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    year: "2008",
    genre: "Science Fiction",
    price: "100.00",
    summary:
      "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy. The series portrays a fictional past, present, and future wherein Earth encounters an alien civilization from a nearby system of three Sun-like stars orbiting one another, a representative example of the three-body problem in orbital mechanics.",
  },
  {
    id: "b2",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    year: "1847",
    genre: "Classic",
    price: "50.50",
    summary:
      "An orphaned governess confronts class, morality, and love at Thornfield Hall, uncovering Mr. Rochester’s secret and forging her own independence.",
  },
  {
    id: "b3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: "1813",
    genre: "Classic",
    price: "85.50",
    summary:
      "Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations in a sharp study of manners and marriage.",
  },
  {
    id: "b4",
    title: "The English Patient",
    author: "Michael Ondaatje",
    year: "1992",
    genre: "Historical Fiction",
    price: "25.75",
    summary:
      "In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts confront memory, identity, and loss.",
  },
  {
    id: "b5",
    title: "Small Gods",
    author: "Terry Pratchett",
    year: "1992",
    genre: "Fantasy",
    price: "98.99",
    summary:
      "In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma, empire, and the nature of belief.",
  },
];

(async () => {
  try {
    // ensure unique on id (good practice)
    await book.collection.createIndex({ id: 1 }, { unique: true });

    // clear and insert
    await book.deleteMany({});
    await book.insertMany(bookItems);

    console.log('Seeded 5 book items.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
