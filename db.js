const { MongoClient } = require("mongodb");

const dbName = "node-books";
const dbRemote =
  "mongodb+srv://tigranpetrosyantsfd:aRiuy35fRUVNBnfN@booksapi.c4zyaa1.mongodb.net/?retryWrites=true&w=majority";

let db;

function connectToDB() {
  return MongoClient.connect(dbRemote)
    .then((client) => {
      db = client.db(dbName);
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      throw err;
    });
}

function getDB() {
  if (!db) {
    throw new Error("Database connection has not been established");
  }
  return db;
}

module.exports = {
  connectToDB,
  getDB,
};
