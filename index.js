const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfrwtfq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    const serviceCollection = client.db('geniusCar').collection('service');

    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // Particular service
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // POST
    app.post('/service', async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // DELETE
    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const result = serviceCollection.deleteOne(qurey);
      res.send(result);
    });
  } finally {
    // client.close()
  }
};

run().catch(console.dir);

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Car service backend');
});

app.listen(port, () => {
  console.log(`port ${port} is up`);
});
