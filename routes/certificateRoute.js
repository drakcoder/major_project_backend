const express = require("express");
const {
  addCertificate,
  updateCertificate,
  getCertificates,
  mineBlock,
  getblockDataForMining,
  getCertificate,
} = require("../controllers/certificateController");

const router = express.Router();

router.get("/:uid", getCertificate);
router.post("/", addCertificate);
router.patch("/", updateCertificate);
router.get("/getCertificateData/:id", getblockDataForMining);
router.post("/mineBlock", mineBlock);
router.get("/:uid/:status", getCertificates);

module.exports = router;
