const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ztzd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try{
        await client.connect();

        // Get Products Api 
        const database = client.db('camera_world');
        const productCollection = database.collection('products');

        app.get ('/products', async (req, res) =>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        }) 
            
        //  Get Explore Api

        const database2 = client.db('camera_world2');
        const exploreCollection = database2.collection('explore');

 
        app.get ('/explore', async (req, res) =>{
            const cursor = exploreCollection.find({});
            const explore = await cursor.toArray();
            res.send(explore);
        })

        // Post Explore Api 

        const databasePost = client.db('camera_worldPost');
        const orderCollection = databasePost.collection('order');
        const usersCollection = databasePost.collection('users');

        app.get('/order', async (req, res) =>{
            const email = req.query.email;
            const query = {email:email}
            console.log(query);
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.json(order)
        })

        app.post ('/order', async (req , res) => {
            const exploreOrder = req.body;
            const result =  await orderCollection.insertOne(exploreOrder);
            res.json(result)
        })

        // Delete Api 

        app.delete('/order/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log('deleting user id', result);
            res.json(result)
        })

        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);           
            console.log(result);
            res.json(result)
        })

        app.put('/users', async (req, res) =>{
            const user = req.body;
            const filter = {email: user.email};
            const options = {upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin',  async (req , res) =>{
            const user = req.body;          
            console.log('put', user);
            const filter = {email: user.email};
            const updateDoc = {$set : {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result);
        })

        // Review Api 
        const databaseReview = client.db('camera_worldReview');
        const reviewCollection = databaseReview.collection('review');

        app.post('/review', async(req, res) =>{
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
        })

        // get all reviews

        app.get('/allReview', async (req ,res) => {
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send( 'Running my Camera World Server !!' )
  })

  app.listen(port, () => {
    console.log('Running Server on port',  port )
})  