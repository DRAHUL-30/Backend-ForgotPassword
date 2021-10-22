const mongo = require("../Shared/mongo");
//importing bcrypt module
const bcrypt = require("bcrypt");
//importing JWT module
const jwt = require("jsonwebtoken");
//importing JOI schema  validation
const { registerSchema, loginSchema } = require("../Shared/schema");

const service = {
  async register(req, res) {
    try {
      // validating using JOI schema
      const { value, error } = await registerSchema.validate(req.body);
      console.log(value);
      if (error)
        return res.status(400).send({ Error: error.details[0].message });

      const data = await mongo.users.findOne({ email: req.body.email });

      console.log(data);

      if (data) return res.status(400).send({ error: "user already exsist" });

      //generating salt
      const salt = await bcrypt.genSalt(12);
      console.log(salt);

      //hashing the password with generated salt
      req.body.password = await bcrypt.hash(req.body.password, salt);
      console.log(req.body.password);
      const insertedData = await mongo.users.insertOne(req.body);

      console.log(insertedData);

      res.status(201).send("user registered");
    } catch (err) {
      console.log("Error in registration", err);
    }
  },

  async login(req, res) {
    // validating using JOI schema
    const { value, error } = await loginSchema.validate(req.body);
    // console.log(validate.error.details)
    if (error) return res.status(400).send({ Error: error.details[0].message });

    //Check email exsist
    const user = await mongo.users.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({ error: "User not found,Please sign up" });

    //check  password using bcrypt.compare()
    const isValid = await bcrypt.compare(req.body.password, user.password);
    console.log(isValid);

    if (!isValid) return res.status(400).send("Incorrect Email/Password");
    // else return res.send(`Welcome ${user.name}`)

    //creating a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    console.log(token);

    //sending response as a token
    res.send({ Token: token });
  },
};

module.exports = service;
