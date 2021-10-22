const router = require("express").Router();

const service = require("../Services/resetPassword.services");

//generating token and sending mail
router.post("/", service.sendToken);

//verifying token with get Method
router.get("/:userId/:token", service.verifyToken);

//verifying token and resetting password
router.post("/:userId/:token", service.verifyAndUpdatePassword);

module.exports = router;
