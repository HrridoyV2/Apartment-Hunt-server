const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://hridoy:Team49@cluster0.smtok.mongodb.net/apartment-hunt?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


client.connect((err) => {
  const rentsCollection = client.db("apartment-hunt").collection("items");
  // perform actions on the collection object
  app.post("/rentData", (req, res) => {
    const data = req.body
    rentsCollection.insertMany(data).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  



  console.log("db connected");
});


app.listen(port);

