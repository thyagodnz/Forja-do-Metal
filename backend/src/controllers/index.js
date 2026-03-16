import { createBand } from './Band/createBand.js'
import { getBands } from './Band/getBands.js'
import { deleteBand } from './Band/deleteBand.js'
import { updateBand } from './Band/updateBand.js'
import { loginBand} from './Band/loginBand.js'
import { logoutBand } from './Band/logoutBand.js'
import { getBandById } from './Band/getBandById.js'
import { getRecentBands } from './Band/getRecentBands.js'

export const BandController = {
    createBand,
    getBands,
    deleteBand,
    updateBand,
    loginBand,
    logoutBand,
    getBandById,
    getRecentBands,
}