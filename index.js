const express = require("express");
const cors = require("cors");
const monk = require("monk");
require('dotenv/config');

const app = express();

const db = monk(process.env.MONGO_URI || "localhost:5000/quoter", () => console.log("Connected to DB"));
const quotes = db.get("quotes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index.html");
});

function isvalidquote(quote) {
    return (
        quote.name &&
        quote.name.toString().trim() !== "" &&
        quote.quote &&
        quote.quote.toString().trim() !== ""
    );
}

app.get('/quoter', (req, res) => {
    quotes
        .find()
        .then(quotes => {
            res.json(quotes);
        });
});

app.post("/quoter", (req, res) => {
    if (isvalidquote(req.body)) {
        const Quotes = {
            name: req.body.name.toString(),
            quote: req.body.quote.toString(),
            color: req.body.color.toString(),
            sculpted: new Date().getDate().toString() + '/' + new Date().getMonth().toString() + '/' + new Date().getFullYear().toString(),
            time: new Date().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            })
        };

        quotes.insert(Quotes).then((createdquote) => {
            res.json(createdquote);
        });
    } else {
        res.status(422);
        res.json({
            message: "Name and Quote is required!",
        });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("listening on 5000");
});