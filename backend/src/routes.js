import { Router } from 'express'
import { BandController } from './controllers/index.js'

const routes = Router()

routes.post('/bands', BandController.createBand)

export default routes