const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llz6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const expressoCollection = client.db('expressoEmperium').collection('expresso');
    const usersCollection = client.db('expressoEmperium').collection('users');


    app.get('/coffees', async(req,res) =>{
      const cursor = expressoCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffees/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await expressoCollection.findOne(query)
      res.send(result)
    })


    app.post('/coffees', async(req,res) =>{
        const newCoffee = req.body;
        const result = await expressoCollection.insertOne(newCoffee);
        res.send(result);
    })

    app.put('/coffees/:id', async(req,res) =>{
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedCoffee = req.body
      const coffee = {
        $set:{
          name:updatedCoffee.name,
           chef:updatedCoffee.chef,
           supplier:updatedCoffee.supplier,
           taste:updatedCoffee.taste,
           category:updatedCoffee.category,
           details:updatedCoffee.details,
           photo:updatedCoffee.photo
        }
      }
      const result = await expressoCollection.updateOne(filter,coffee,options)
      res.send(result)
    })

    app.delete('/coffees/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await expressoCollection.deleteOne(query)
      res.send(result)
    })

    // users --------------------------------------------------

    app.get('/users', async(req,res) =>{
      const cursor = usersCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/users', async(req,res) =>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result)
    })


    app.patch('/users', async(req,res) =>{
      const email = req.body?.email
      const filter = {email}
      const updatedDoc = {
        $set:{
         lastSignInTime : req.body?.lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })


    app.delete('/users/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('expresso empreium running bro')
})
app.listen(port, ()=>{
    console.log(`expresso empreium running bro on port : ${port}`);
})