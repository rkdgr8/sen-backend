const jwt = require("jsonwebtoken");
const Admin = require("../models/administrators");

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("Missing Token");
    res.status(500).send("Token Not Provided.");
  } else {
    jwt.verify(token, process.env.SIGNIN_SECRET, function(err, decoded) {
      if (err) {
        console.log("Error Decoding Token.");
        res.status(500).send("Error Decoding Token.");
      } else next();
    });
  }
};

exports.signIn = (req, res) => {
  Admin.findOne({ username: req.body.username })
    .exec()
    .then(admin => {
      if (!admin) {
        res.status(500).send({ message: "Admin does not exist." });
      } else if (admin.password !== req.body.password) {
        res.status(500).send({ message: "Incorrect password." });
      } else {
        const token = jwt.sign(
          {
            username: admin.username
          },
          process.env.SIGNIN_SECRET,
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .send({ message: "Successfully signed in.", token, admin });
      }
    });
};
