const express = require('express')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503)
//     res.send('Site under construction! Please check back soon!')
// })

app.use(express.json())

app.use(require('./routers/user'))
app.use(require('./routers/task'))

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})