
const {ALL_USERS} = require("../auth/authenticate");
const { getReturnableUserObject } = require("../utils/utils");
const updateUser = (req, res) => {
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
      
  };

  const deleteUser = (req, res) => {
        for(var i = 0; i < ALL_USERS.length; i++) {
            if(ALL_USERS[i].username == req.body.username) {
                ALL_USERS.splice(i, 1);
                res.status(200).send("User deleted successfully!");
                return
            }
        }
        res.status(404).send("User Not Found");
  };

  exports.updateUser = updateUser;
  exports.deleteUser = deleteUser;