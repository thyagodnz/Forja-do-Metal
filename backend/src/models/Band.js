import mongoose from "mongoose";

const addressBand = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  instrument: {
    type: String,
    required: true,
    trim: true,
  },

  photo: {
    type: String,
    default: "",
  },

  bio: {
    type: String,
    trim: true,
    default: "",
  },
});

const socialLinksSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const bandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    address: {
      type: addressBand,
      required: true,
    },

    members: {
      type: [memberSchema],
      required: true,
      validate: (v) => v.length > 0,
    },

    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },

    musicalGenre: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    coverPicture: {
      type: String,
      default: "",
    },

    socialLinks: {
      type: [socialLinksSchema],
      default: [],
    },
  },
  { timestamps: true },
);

bandSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
    delete ret.password;

    if (ret.members) {
      ret.members = ret.members.map((member) => {
        member.id = member._id;
        delete member._id;
        return member;
      });
    }

    return ret;
  },
});

export default mongoose.model("Band", bandSchema);
