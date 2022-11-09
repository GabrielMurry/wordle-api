const User = require("../model/User");

const handleGetAllUsers = async (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      res.send("Error: Could not retrieve all users.");
      next;
    }
    res.json({ users }); // make sure to send response packaged as an object to avoid complications in front end
  });
};

module.exports = { handleGetAllUsers };
