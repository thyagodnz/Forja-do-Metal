import express from 'express'
import routes from './routes.js'
import connectDataBase from './config/database.js'
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    // credentials: true
}))

app.use(express.json())
app.use(routes)

connectDataBase()
    .then(() => {
        app.listen(port, () => console.log('Servidor conectado'))
    })
    .catch((error) => console.log(error))