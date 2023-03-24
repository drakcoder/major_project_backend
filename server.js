const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connect } = require("./DB/connect");
const userRouter = require("./routes/userRoute");
const certificateRoute = require("./routes/certificateRoute");
const { method } = require("lodash");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: 'Content-Type'
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/certificate", certificateRoute);

app.listen(process.env.PORT || 80, async () => {
  console.log("listening to port " + (process.env.PORT || 3000));
  await connect();
});
