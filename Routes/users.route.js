const router = require("express").Router();

const service = require("../Services/users.services");

router.post("/register", service.register);

router.post("/login", service.login);

module.exports = router;
