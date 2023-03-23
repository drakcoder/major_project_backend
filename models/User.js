const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["student", "university", "company"],
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profile: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

module.exports = mongoose.model("User", User);
