require("dotenv").config();
const express = require("express");
const mongo = require("./Shared/mongo");
const app = express();
const resetRoute = require("./Routes/resetPassword.route");
const userRoute = require("./Routes/users.route");

(async () => {
  try {
    await mongo.connect();
    app.use(express.json());
    const PORT = process.env.PORT || 5000;
    app.use("/users", userRoute);
    app.use("./resetPassword", resetRoute);
    app.listen(process.env.PORT, () => {
      console.log(`Server started at ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error while connecting with DB", err);
  }
})();
