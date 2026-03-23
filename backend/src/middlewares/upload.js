import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const resourceId = req.params.id;

    let folder = "";
    let public_id = "";
    let transformation = [];

    if (req.baseUrl.includes("/bands")) {
      folder = `forja-do-metal/bands/${resourceId}`;

      if (file.fieldname === "profilePicture") {
        public_id = "profile";
        transformation = [
          {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "face",
            quality: "auto",
            fetch_format: "webp",
          },
        ];
      }

      if (file.fieldname === "coverPicture") {
        public_id = "cover";
        transformation = [
          {
            width: 1500,
            height: 500,
            crop: "fill",
            quality: "auto",
            fetch_format: "webp",
          },
        ];
      }
    }

    if (req.baseUrl.includes("/users")) {
      folder = `forja-do-metal/users/${resourceId}`;

      if (file.fieldname === "profilePicture") {
        public_id = "profile";
        transformation = [
          {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "face",
            quality: "auto",
            fetch_format: "webp",
          },
        ];
      }
    }

    return {
      folder,
      public_id,
      overwrite: true,
      resource_type: "image",
      transformation,
    };
  },
});

export const upload = multer({ storage });