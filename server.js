const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connect } = require("./DB/connect");
const userRouter = require("./routes/userRoute");
const certificateRoute = require("./routes/certificateRoute");

const app = express();
dotenv.config();

app.enable('trust proxy')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/certificate", certificateRoute);

app.listen(process.env.PORT || 80, async () => {
  console.log("listening to port " + (process.env.PORT || 3000));
  await connect();
});
