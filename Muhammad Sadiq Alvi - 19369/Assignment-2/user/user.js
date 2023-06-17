const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {ALL_USERS} = require("../auth/authenticate");
const { getReturnableUserObject } = require("../utils/utils");
const updateUser = (req, res) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
      }
      const tokenKey = process.env.TOKEN_KEY;
      try {
        jwt.verify(token, tokenKey);
        for(var i = 0; i < ALL_USERS.length; i++) {
            if(ALL_USERS[i].username == req.body.username) {
                ALL_USERS[i].firstName = req.body.firstName;
                ALL_USERS[i].lastName = req.body.lastName;
                res.status(200).send({"user": getReturnableUserObject(ALL_USERS[i])});
                return
            }
        }
        res.status(404).send("User Not Found");
        return;
      } catch (err) {
        console.log("Error: ", err);
        res.status(401).send("Invalid Token");
        return;
      }
  };

  const deleteUser = (req, res) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
      }
      const tokenKey = process.env.TOKEN_KEY;
      try {
        jwt.verify(token, tokenKey);
        for(var i = 0; i < ALL_USERS.length; i++) {
            if(ALL_USERS[i].username == req.body.username) {
                ALL_USERS.splice(i, 1);
                res.status(200).send("User deleted successfully!");
                return
            }
        }
        res.status(404).send("User Not Found");
        return;
      } catch (err) {
        console.log("Error: ", err);
        res.status(401).send("Invalid Token");
        return;
      }
  };

  exports.updateUser = updateUser;
  exports.deleteUser = deleteUser;