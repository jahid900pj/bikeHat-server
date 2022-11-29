const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const colors = require('colors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

// assigment-12
// du9BuNOOBwBDDIbc

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6l0by.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    // console.log('token vvv', req.headers.authorization)
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send('unauthorize access')
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access1' })
        }
        req.decoded = decoded
        next()
    })

}

async function run() {
    try {
        await client.connect()
        console.log('Db connected'.yellow)
        // assigment-12

        const bikeCategories = client.db('assigment-12').collection('bike-categories')
        const bikeCollections = client.db('assigment-12').collection('bike-collections')
        const bikeBookings = client.db('assigment-12').collection('bookings')
        const usersCollections = client.db('assigment-12').collection('users')

        app.get('/bikeCategories', async (req, res) => {
            const query = {}
            const result = await bikeCategories.find(query).toArray()
            res.send(result)
        })


        app.get('/bikeCollections/:category_id', async (req, res) => {
            const id = req.params.category_id
            const query = { category_id: id }
            const result = await bikeCollections.find(query).toArray()
            res.send(result)
        })

        app.post('/bikeBooking', async (req, res) => {
            const booking = req.body;
            const result = await bikeBookings.insertOne(booking)
            res.send(result)
        })

        app.get('/bikeBooking', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            // console.log(decodedEmail)
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access2' })
            }
            const query = { email: email }
            const bookings = await bikeBookings.find(query).toArray()
            res.send(bookings)

        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollections.findOne(query)
            // console.log(user)
            // res.send({ accessToken: "token" })
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '12h' });
                // console.log(process.env.ACCESS_TOKEN)
                return res.send({ accessToken: token })
            }

            res.status(403).send({ accessToken: '' })
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user)
            res.send(result)
        })

        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            const result = await bikeCollections.insertOne(product)
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