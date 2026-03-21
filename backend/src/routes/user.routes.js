import { Router } from "express"
import { UserController } from "../controllers/index.js"
import { auth } from "../middlewares/auth.js"
import { upload } from "../middlewares/upload.js"

const router = Router()

router.get("/", UserController.getUsers)
router.post("/", UserController.createUser)

router.put(
    "/:id",
    auth,
    upload.single("profilePicture"),
    UserController.updateUser
)

router.delete("/:id", UserController.deleteUser)

export default router