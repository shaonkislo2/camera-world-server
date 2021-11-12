const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
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

        app.post ('/order', async (req , res) => {
            const exploreOrder = req.body;
            const result =  await orderCollection.insertOne(exploreOrder);
            console.log(result);
            res.json(result)
        })


        

      
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my Camera World Server !!')
  })

  app.listen(port, () => {
    console.log('Running Surver on port',  port)
})  