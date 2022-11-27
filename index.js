const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const colors = require('colors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

// assigment-12
// du9BuNOOBwBDDIbc

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6l0by.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()
        console.log('Db connected'.yellow)
        // assigment-12

        const bikeCategories = client.db('assigment-12').collection('bike-categories')


        // app.get('/appointmentSpecialty', async (req, res) => {
        //     const query = {}
        //     const result = await appointmentCollections.find(query).project({ name: 1 }).toArray()
        //     res.send(result)
        // })

        app.get('/bikeCategories', async (req, res) => {
            const query = {}
            const result = await bikeCategories.find(query).toArray()
            res.send(result)
        })
    }
    finally {

    }
}
run().catch()



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})