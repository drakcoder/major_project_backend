const mongoose = require("mongoose");

const Certificate = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    URL: {
      type: String,
      required: true,
    },
    sharedWith: {
      type: [String],
      default: [],
    },
    issuedBy: {
      type: String,
      default: null,
    },
    credentialId: {
      type: String,
      default: null,
    },
    mined: {
      type: Boolean,
      default: false,
      required: true,
    },
    userUid: {
      type: String,
      required: true,
    },
    file: {
      type: Object,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: false }
);

module.exports = mongoose.model("Certificate", Certificate);
