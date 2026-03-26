import { Router } from "express"
import bandRoutes from "./band.routes.js"
import userRoutes from "./user.routes.js"
import { AuthController } from "../controllers/index.js";
import { auth } from "../middlewares/auth.js"

const routes = Router()

// módulos
routes.use("/bands", bandRoutes)
routes.use("/users", userRoutes)

// auth
routes.post("/auth/login", AuthController.login)
routes.post("/auth/logout", AuthController.logout)
routes.get("/auth/me", auth, AuthController.me);

export default routes