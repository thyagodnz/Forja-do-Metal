import { Router } from 'express'
import { BandController } from './controllers/index.js'
import { auth } from './middlewares/auth.js'

const routes = Router()

routes.post('/bands', BandController.createBand)

routes.get('/bands', BandController.getBands)
routes.get('/bands/recent', BandController.getRecentBands)
routes.get('/bands/:id', BandController.getBandById)

routes.delete('/bands/:id', BandController.deleteBand)
routes.put('/bands/:id', BandController.updateBand)

routes.post('/auth/login', BandController.loginBand)
routes.post('/auth/logout', auth, BandController.logoutBand)

routes.get('/auth/me', auth, (req, res) => {
    return res.json(req.user)
})

export default routes