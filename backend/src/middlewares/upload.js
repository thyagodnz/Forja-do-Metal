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
      if (file.fieldname === "profilePicture") {
        folder = `forja-do-metal/bands/${resourceId}`;
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
        folder = `forja-do-metal/bands/${resourceId}`;
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

      if (file.fieldname.startsWith("memberPhoto_")) {
        const memberId = file.fieldname.replace("memberPhoto_", "");

        folder = `forja-do-metal/bands/${resourceId}/members`;
        public_id = `member-${memberId}`;

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

    if (req.baseUrl.includes("/users")) {
      if (file.fieldname === "profilePicture") {
        folder = `forja-do-metal/users/${resourceId}`;
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