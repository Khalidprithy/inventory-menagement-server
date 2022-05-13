const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;
const app = express();

require('dotenv').config();

// Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tu7gy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('inventoryApp').collection('product');

        // Find All
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // Find One
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })


        // Delete Product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result)
        });

        // Add Product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Inventory app server running')
});

app.listen(port, () => {
    console.log('Listening to inventory server', port)
})