const mongoose = require("mongoose");

const connect = () => {
  mongoose.set("strictQuery", false);
  let res = mongoose.connect(process.env.MONGO_URL, (err, conn) => {
    if (conn) {
      console.log("connected to db");
    } else if (err) {
      console.log(err);
    }
  });
};

module.exports = {
  connect,
};
