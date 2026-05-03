const express = require('express')
const db = require('./config/db')
const productRouter = require('./products/product.route')
const userRouter = require('./users/user.route')
const app = express()

app.use(express.json())

app.use('/products', productRouter)
app.use('/users', userRouter)

app.get('/', (req, res) => {
    res.send('hello world')
})



db().then(res => {
    app.listen(3000, () => {
        console.log('server running on http://localhost:3000')
    })
})

