const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log("the uri is", uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database');

        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("getting single service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //Post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            // const service = {
            //     "name": "Replace Tire",
            //     "price": 2000,
            //     "time": 2,
            //     "description": "lorem ipsum lorem ipsum hijibiji lorem ipsum hijibiji lorem ipsum hijibiji lorem ipsum hijibiji lorem ipsum hijibiji lorem ipsum hijibiji lorem ipsum hijibiji ",
            //     "img": "https://i.ibb.co/nDJq2hP/1.jpg"
            // }
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            // res.send('post hitted')
            res.json(result)
        });

        //Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running genius server')
});

app.listen(port, () => {
    console.log('Running genius server ', port);
})