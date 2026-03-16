import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const bandId = req.params.id

    let public_id = ""
    let transformation = []

    if (file.fieldname === "profilePicture") {
      public_id = `bands/${bandId}/profile`

      transformation = [
        {
          width: 400,
          height: 400,
          crop: "fill",
          gravity: "face",
          quality: "auto",
          fetch_format: "webp"
        }
      ]
    }

    if (file.fieldname === "coverPicture") {
      public_id = `bands/${bandId}/cover`

      transformation = [
        {
          width: 1500,
          height: 500,
          crop: "fill",
          quality: "auto",
          fetch_format: "webp"
        }
      ]
    }

    return {
      public_id,
      overwrite: true,
      transformation
    }
  }
})

export const upload = multer({ storage })