const dotenv = require('dotenv');
dotenv.config();
const ALL_USERS = [];
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getReturnableUserObject } = require("../utils/utils");

const authenticate = async (username, password) => {
    
      for(var i = 0; i < ALL_USERS.length; i++) {
        const user = ALL_USERS[i];
        const userPassword =user["password"];
        console.log(`User password: ${userPassword}`);
        console.log(`user: ${JSON.stringify(user)}`);
        if(user["username"] == username && (await bcrypt.compare(password, userPassword))) {
            
            const token = jwt.sign(
                { user_id: user.id, email: user.email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
            user.token = token;
            return getReturnableUserObject(user);
        }
      }
      return null;
};


const signup = async (username, password, email, firstName, lastName) => {
    for(var i = 0; i < ALL_USERS.length; i++) {
        if(ALL_USERS[i]["username"] == username || ALL_USERS[i]["email"] == email) {
            return "User already exists";
        }
    }
    const hash = await bcrypt.hash(password, 10);
    const user = {"id": ALL_USERS.length, "firstName": firstName, "lastName": lastName, "username": username, "email": email, "password": hash};
    const tokenKey = process.env.TOKEN_KEY;
    console.log(`Token key: ${tokenKey}`);
    const token = jwt.sign(
        { user_id: user.id, email },
        tokenKey,
        {
          expiresIn: "2h",
        }
      );
    user["token"] = token;
    ALL_USERS.push(user);
    return getReturnableUserObject(user);
};



exports.authenticate = authenticate;
exports.signup = signup;
exports.ALL_USERS = ALL_USERS;