const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const model = require('./model/book');
const cors = require('cors');
require('dotenv').config();

const mongoURL = process.env.MONGO_URL;
const Book = mongoose.model("books", model.BookSchema);

mongoose.connect(mongoURL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is books service");
});

app.post("/book", cors(), (req, res) => {
    const book = new Book(req.body);
    book.save()
        .then(data => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(400).send(error);
        });
});

app.get("/allBooks", (req, res) => {
    Book.find()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(400).send(error);
        });
});

app.get("/book/id", (req, res) => {
    Book.findById(req.query.id)
        .then(data => {
            const response = !!data ? data : 'No data with specified id found'
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(400).send(error);
        });
});

app.delete("/book/id", (req, res) => {
    Book.findByIdAndDelete(req.query.id)
        .then(result => {
            const response = !!result ? result : 'No data with specified id found'
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(400).send(error);
        });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
})