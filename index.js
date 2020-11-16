const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
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
  
  const ordersCollection = client.db("apartment-hunt").collection("orders");
  // perform actions on the collection object
  
  //Send RentsData from server to Homepage
  app.get("/rentData", (req, res) => {
    rentsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  });
  //
    app.get("/home/:id", (req, res) => {
      rentsCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        });
    });    
  //
    app.post('/orderRent', (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
    })
  //



  console.log("db connected");
});


app.listen(port);

