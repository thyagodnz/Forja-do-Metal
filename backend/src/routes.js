import { Router } from 'express'
import { BandController } from './controllers/index.js'

const routes = Router()

routes.post('/bands', BandController.createBand)
routes.get('/bands', BandController.getBands)
routes.delete('/bands/:id', BandController.deleteBand)
routes.put('/bands/:id', BandController.updateBand)


export default routes