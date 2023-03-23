const Certificate = require("../models/Certificate");
const shortid = require("shortid");
const axios = require("axios");
const _ = require("lodash");

const addCertificate = async (req, res, next) => {
  try {
    const body = req.body;
    const {
      name,
      description,
      url,
      sharedWith,
      userUid,
      issuedBy,
      credentialId,
      file,
    } = body;
    const uid = shortid.generate();
    const certificate = new Certificate({
      name,
      description,
      sharedWith,
      userUid,
      issuedBy,
      credentialId,
      file,
      uid: uid,
      URL: url,
    });
    await certificate.save();
    let concatData = name + description + url;
    let block = {
      string_data: concatData,
      image_url: url,
      user_uid: userUid,
      certificate_uid: uid,
      date: new Date(),
      init_mined: true,
    };
    await axios.post(`http://${process.env.BLOCKCHAIN_URL}/api/v1/addBlock`, block);
    return res.status(201).send({
      result: true,
      certificate: certificate.toJSON(),
      message: "certificate saved succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      result: false,
      error,
    });
  }
};

const updateCertificate = async (req, res, next) => {
  const body = req.body;
  let uid = _.get(body, ["uid"]);
  if (!uid) {
    return res.status(404).send({
      result: false,
      certificate: null,
      message: "certificate uid is required",
    });
  }
  let certificate = await Certificate.findOne({
    uid: uid,
  });
  const isDeleteChanged = certificate.isDeleted !== body.isDeleted;
  _.assign(certificate, {
    ..._.pick(body, ["sharedWith", "file", "isDeleted"]),
  });
  await certificate.save();
  let nonEditable = _.pick(body, [
    "name",
    "description",
    "url",
    "credentialId",
  ]);
  if (!_.isEmpty(nonEditable)) {
    _.assign(certificate, nonEditable);
    let concatData =
      certificate.name + certificate.description + certificate.url;
    let block = {
      string_data: concatData,
      image_url: certificate.URL,
      user_uid: certificate.userUid,
      certificate_uid: uid,
      init_mined: certificate.mined,
    };
    await axios.post(`http://${process.env.BLOCKCHAIN_URL}/api/v1/addBlock`, block);
  }
  if (certificate.mined == false) {
    await certificate.save();
  }
  let message = "Updated Successfully";
  if (isDeleteChanged)
    if (certificate.isDeleted) message = "Certificate deleted successfully";
    else message = "Certificate restored successfully";
  res.status(200).send({
    result: true,
    certificate,
    message,
  });
};

const mineBlock = async (req, res, next) => {
  const { prevBlock, currBlock, nonce } = req.body;
  let reqBody = {
    block_uid: currBlock,
    prev_block: prevBlock,
    nonce: nonce,
  };
  let response = await axios.post(
    `http://${process.env.BLOCKCHAIN_URL}/api/v1/mineBlock`,
    reqBody
  );
  if (response.data.success) {
    await Certificate.updateOne(
      { uid: _.get(response, ["data", "certificateid"]) },
      { $set: { mined: true } }
    );
  }
  // TODO: Mined successfull(message) ,result true , certificate
  // TODO: Mined unsuccessfull(message) ,result false , certificate: null
  // TODO: Already Mined(message) ,result false , certificate: null
  return res.send(response.data);
};

const getCertificates = async (req, res, next) => {
  try {
    const { uid, status } = req.params;
    let certificates = [];
    if (status === "shared")
      certificates = await Certificate.find({
        sharedWith: { $in: [uid] },
      });
    else if (status === "deleted")
      certificates = await Certificate.find({
        userUid: uid,
        isDeleted: true,
      });
    else
      certificates = await Certificate.find({
        userUid: uid,
        isDeleted: false,
      });
    return res.send({
      result: true,
      certificates: certificates,
    });
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({
      result: false,
      certificates: null,
      message: "Error occurred",
    });
  }
};

const getCertificate = async (req, res, next) => {
  try {
    const { uid } = req.params;
    let certificate = await Certificate.find({
      uid: uid,
      isDeleted: false,
    });
    if (certificate.length)
      return res.send({
        result: true,
        certificate: certificate[0],
      });
    return res.send({
      result: true,
      certificate: null,
      message: "Certificate not exists",
    });
  } catch (err) {
    console.log("Error occurred", err);
    return res.send({
      result: false,
      certificate: null,
      message: "Error occurred",
    });
  }
};

const getblockDataForMining = async (req, res, next) => {
  let certificateId = req.params.id;
  let latestBlock = await axios.get(
    `http://${process.env.BLOCKCHAIN_URL}/api/v1/getLatestBlock`
  );
  let currBlock = await axios.get(
    `http://${process.env.BLOCKCHAIN_URL}/api/v1/getBlock/${certificateId}`
  );
  return res.status(200).send({
    lastBlock: latestBlock.data,
    block: currBlock.data,
  });
};

module.exports = {
  addCertificate,
  updateCertificate,
  mineBlock,
  getCertificates,
  getblockDataForMining,
  getCertificate,
};
