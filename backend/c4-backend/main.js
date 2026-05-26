const express = require('express')
const db = require('./config/db')
const productRouter = require('./products/product.route')
const userRouter = require('./users/user.route')
const authRouter = require('./auth/auth.route')
const app = express()

app.use(express.json())
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON body' })
    }

    next(err)
})
app.use('/auth', authRouter)
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

