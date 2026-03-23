import { createBand } from './Band/createBand.js'
import { getBands } from './Band/getBands.js'
import { deleteBand } from './Band/deleteBand.js'
import { updateBand } from './Band/updateBand.js'
import { getBandById } from './Band/getBandById.js'
import { getRecentBands } from './Band/getRecentBands.js'

import { createUser } from './User/createUser.js'
import { getUsers } from './User/getUsers.js'
import { deleteUser } from './User/deleteUser.js'
import { updateUser } from './User/updateUser.js'
import { getUserById } from './User/getUserById.js'
import { toggleFavoriteBand } from './User/toggleFavoriteBand.js'

import { login } from './Auth/login.js'
import { logout } from './Auth/logout.js'
import { me } from './Auth/me.js'

export const BandController = {
    createBand,
    getBands,
    deleteBand,
    updateBand,
    getBandById,
    getRecentBands,
}

export const UserController = {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
    getUserById,
    toggleFavoriteBand,
}

export const AuthController = {
    login,
    logout,
    me,
}