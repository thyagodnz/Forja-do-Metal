import { Router } from "express"
import { BandController } from "../controllers/index.js"
import { auth } from "../middlewares/auth.js"
import { upload } from "../middlewares/upload.js"

const router = Router()

router.post("/", BandController.createBand)
router.get("/", BandController.getBands)
router.get("/recent", BandController.getRecentBands)
router.get("/:id", BandController.getBandById)
router.delete("/:id", auth, BandController.deleteBand)

router.put(
    "/:id",
    auth,
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "coverPicture", maxCount: 1 },
    ]),
    BandController.updateBand
)

export default router