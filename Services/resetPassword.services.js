const mongo = require("../shared/mongo");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendMail = require("../shared/sendMailer");
const { ObjectId } = require("mongodb");

const service = {
  async sendToken(req, res, next) {
    let user = await mongo.users.findOne({ email: req.body.email });
    console.log(user);
    if (!user) res.status(400).send("User doesnot exists");

    if (user.resetToken) {
      let data = await mongo.users.update(
        { email: user.email },
        { $unset: { resetToken: 1, resetExpire: 1 } }
      );
      console.log(data);
    }
    // creating a string and hashing using bcrypt
    let token = crypto.randomBytes(32).toString("hex");
    let hashToken = await bcrypt.hash(token, Number(12));
    console.log(token, hashToken);
    //creating expiry after 1 hour
    let expiry = new Date(Date.now() + 1 * 3600 * 1000);
    //updating the users table with resetToken and resetExpire
    let data = await mongo.users.findOneAndUpdate(
      { email: user.email },
      { $set: { resetToken: hashToken, resetExpire: expiry } },
      { ReturnDocument: "after" }
    );
    console.log(data);

    const link = `http://localhost:3001/resetPassword/${user._id}/${token}`;

    await sendMail(user.email, "Password Reset", link);

    res.status(200).send("Link sent to email");
  },
  async verifyToken(req, res, next) {
    let user = await mongo.users.findOne({ _id: ObjectId(req.params.userId) });
    if (!user) return res.status(400).send("Invalid link or expired");

    let token = req.params.token;

    const isValid = await bcrypt.compare(token, user.resetToken);
    const expire = user.resetExpire > Date.now();

    if (isValid && expire) {
      res.status(200).send({ success: true });
    } else res.status(400).send({ Error: "invalid link or expired" });
  },

  async verifyAndUpdatePassword(req, res, next) {
    let user = await mongo.users.findOne({ _id: ObjectId(req.params.userId) });
    if (!user) return res.status(400).send("Invalid link or expired");

    let token = req.params.token;

    const isValid = await bcrypt.compare(token, user.resetToken);
    const expire = user.resetExpire > Date.now();
    console.log(Date.now(), user.resetExpire.getTime(), expire);
    if (isValid && expire) {
      const password = req.body.password;
      const hashPassword = await bcrypt.hash(password, Number(12));
      console.log(hashPassword);
      let data = await mongo.users.findOneAndUpdate(
        { _id: ObjectId(req.params.userId) },
        {
          $set: { password: hashPassword },
          $unset: { resetToken: 1, resetExpire: 1 },
        },
        { ReturnDocument: "after" }
      );
      console.log(data);
      res.status(200).send("password updated successfully");
    } else res.status(400).send("Invalid link or expired");
  },
};

module.exports = service;
