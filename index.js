const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.BD_USER);

// console.log(process.env.BD_PASS );

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ihxtrhm.mongodb.net/?retryWrites=true&w=majority`;

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

        const foodCollection = client.db('restaurantManagement').collection('foods');
        const purchaseCollection = client.db('restaurantManagement').collection('purchase');
        const userCollection = client.db('restaurantManagement').collection('user');
        const myItemCollection = client.db('restaurantManagement').collection('myItem');

        // foodCollection
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // purchaseCollection

        app.post('/purchased', async (req, res) => {
            const purchaseItem = req.body;
            console.log(purchaseItem);
            const result = await purchaseCollection.insertOne(purchaseItem);
            res.send(result);
        })

        app.get('/purchased', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await purchaseCollection.find().toArray();
            res.send(result);



        })

        app.delete('/purchased/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await purchaseCollection.deleteOne(query);
            res.send(result);
        })

        // userCollection
        app.post('/users', async (req, res) => {
            const userinfo = req.body;
            console.log(userinfo);
            const result = await userCollection.insertOne(userinfo);
            res.send(result);
        })

        // myItemCollection
        app.post('/myItems', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await myItemCollection.insertOne(newProduct);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Restaurant management is running')

})

app.listen(port, () => {
    console.log(`Restaurant management is running on port ${port}`)
})