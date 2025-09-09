import express from 'express'
import routes from './routes.js'
import connectDataBase from './config/database.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(routes)

connectDataBase()
    .then(() => {
        app.listen(port, () => console.log('Servidor conectado'))
    })
    .catch((error) => console.log(error))