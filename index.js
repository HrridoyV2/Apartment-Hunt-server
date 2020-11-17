const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smtok.mongodb.net/apartment-hunt?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("service"));
app.use(fileUpload());

const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


client.connect((err) => {
  const rentsCollection = client.db("apartment-hunt").collection("items");

  const ordersCollection = client.db("apartment-hunt").collection("orders");

  const adminsCollection = client.db("apartment-hunt").collection("admins");

  // perform actions on the collection object

  //Send RentsData from server to Homepage
  app.get("/rentData", (req, res) => {
    rentsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
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
  app.post("/orderRent", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //
  // loading all orders
  app.get("/allOrders", (req, res) => {
    ordersCollection.find({}).toArray((err, docs) => res.send(docs));
  });
  // loading orders by email
  app.get("/myRents/:email", (req, res) => {
    ordersCollection
      .find({ email: req.params.email })
      .toArray((err, docs) => res.send(docs));
  });
  // adding new service
  app.post("/addService", (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const location = req.body.location;
    const price = req.body.price;

    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    rentsCollection
      .insertOne({ title, location, price, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
  //
  //
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
  //
  // updating order
  app.patch("/edit/:id", (req, res) => {
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            status: req.body.status,
          },
        }
      )
      .then((result) => res.send(result.modifiedCount > 0));
  });
  //

  console.log("db connected");
});


app.listen(process.env.PORT || port)

