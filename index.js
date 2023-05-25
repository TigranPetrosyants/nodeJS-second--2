const express = require("express");
const { connectToDB } = require("./db");
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} = require("./endpoints");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`Server is running on port ${process.env.PORT || port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.post("/", createBook);

app.get("/", getBooks);

app.get("/:id", getBook);

app.put("/:id", updateBook);

// app.delete("/:id", deleteBook);
