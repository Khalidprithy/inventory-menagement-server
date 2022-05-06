const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

require('dotenv').config();

// Middleware

app.use(cors());
app.use(express.json());


//  user1
// KOVOGlSVRlylG7OS


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tu7gy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('inventoryApp').collection('product');

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

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