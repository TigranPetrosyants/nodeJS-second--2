const { ObjectId } = require("mongodb");
const { getDB } = require("./db");

const collectionName = "books";

function validObjectId(id) {
  return ObjectId.isValid(id) && (id.length === 24);
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
    .find(
        { _id: new ObjectId(id) }
    )
    .toArray()
    .then((result) => {
      const book = result;
      if (book.length > 0) {
        return res.status(200).json(book);
      }else {
        return res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch((err) => {
      console.error('Error getting book', err);
      res.status(500).json({ error: 'Error getting book' });
    });

  }else {
    res.status(404).json({ error: 'Object ID is not valid' });
  }
}

module.exports = {
  getBooks,
  getBook,
};
