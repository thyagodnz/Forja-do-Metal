import { Router } from 'express'
import { BandController } from './controllers'
const routes = Router()
routes.post('/bands', BandController.createBand)
//rotas

export default routes