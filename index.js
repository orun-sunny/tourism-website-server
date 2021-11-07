const express = require('express')

const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();
var cors = require('cors')

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const { json } = require('express');





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmd33.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log('hitting')



// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log('hitting');

async function run() {
  try {
    await client.connect();
    const tourhobe_db = client.db("tour-hobe");
    const packageCollection = tourhobe_db.collection("packages");
    const bookingCollection = tourhobe_db.collection("bookings");

    app.get('/home', async (req, res) => {
      // packageCollection.insertOne({ name: 'John', address: 'Highway 71'});
      res.send({ name: 'John', address: 'Highway 71' })
    });

    app.get('/package', async (req, res) => {
      const packages = await packageCollection.find().toArray();
      res.send(packages);
    });

    app.get('/package-details/:id', async (req, res) => {
      const { id } = req.params;
      const package = await packageCollection.findOne({ "_id": ObjectId(id) });
      res.send(package);
    });

    app.post('/package', async (req, res) => {
      packageCollection.insertOne(req.body);
      res.send("Successfully Added New Package.");
    });

    app.post('/booking', async (req, res) => {
      bookingCollection.insertOne(req.body);
      res.send("Your booking request is done...");
    });

    app.delete('/delete-booking/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      bookingCollection.deleteOne({ "_id": ObjectId(id) });
      res.send({ id: id, massage: `your booking successfully deleted...` });
    });

    app.put('/update-booking-status/:bookingId/:value', async (req, res) => {
      const { bookingId, value } = req.params;
      console.log(bookingId, value)
      bookingCollection.updateOne({ "_id": ObjectId(bookingId) }, { $set: { "status": value } });
      res.send({ bookingId: bookingId, massage: `your booking status successfully updated...` });
    });

    app.get('/my-bookings/:email', async (req, res) => {
      const { email } = req.params;
      const myBookings = await bookingCollection.find({ "email": email }).toArray();
      res.send(myBookings);
    });

    app.get('/all-bookings', async (req, res) => {
      const myBookings = await bookingCollection.find().toArray();
      res.send(myBookings);
    });
  }
  finally {
    // client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})