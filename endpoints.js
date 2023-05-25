const { ObjectId } = require("mongodb");
const { getDB } = require("./db");

const collectionName = "books";

function validObjectId(id) {
  return ObjectId.isValid(id) && id.length === 24;
}

function getBooks(req, res) {
  const book = req.body;
  const db = getDB();
  const collection = db.collection(collectionName);

  collection
    .find()
    .toArray()
    .then((result) => {
      const books = result;
      return res.status(200).send(books);
    });
}

function getBook(req, res) {
  const id = req.params.id;
  if (validObjectId(id)) {
    const db = getDB();
    const collection = db.collection(collectionName);

    collection
      .find({ _id: new ObjectId(id) })
      .toArray()
      .then((result) => {
        const book = result;
        if (book.length > 0) {
          return res.status(200).json(book);
        } else {
          return res.status(404).json({ error: "Book not found" });
        }
      })
      .catch((err) => {
        console.error("Error getting book", err);
        res.status(500).json({ error: "Error getting book" });
      });
  } else {
    res.status(404).json({ error: "Object ID is not valid" });
  }
}

function createBook(req, res) {
  if (req.body.title && req.body.author) {
    const { title, author } = req.body;
    const newBook = {
      date: new Date(),
      title,
      author,
    };

    const db = getDB();
    const collection = db.collection(collectionName);

    collection
      .findOne({ title: newBook.title })
      .then((existingBook) => {
        if (existingBook) {
          return res.status(409).json({ error: "Book already exists" });
        }

        collection
          .insertOne(newBook)
          .then((result) => {
            return res.status(201).json(result);
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ Error: "Unable to add book" });
          });
      })
      .catch((err) => {
        console.error("Error checking duplicate book", err);
        res.status(500).json({ error: "Error checking duplicate book" });
      });
  } else {
    res.status(404).send("The Title or Author fields are empty.");
  }
}

function updateBook(req, res) {
  const id = req.params.id;
  const fields = req.body;

  if (validObjectId(id)) {
    const db = getDB();
    const collection = db.collection(collectionName);

    collection
    .updateOne({ _id: new ObjectId(id) }, { $set: fields })
    .then(result => {
      if (result.matchedCount != 0) {
        return res.status(200).json(result);
      }else {
        return res.status(404).send('Book not found');
      }
    })
    .catch(err => {
      console.error('Error updating book', err);
      res.status(500).send('Error updating book');
    });
    
  }else {
    return res.status(404).send('Invalid ObjectID');
  }
}

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
};
