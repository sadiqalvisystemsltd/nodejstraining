const getReturnableUserObject = (user) => {
    const userCopy = { ...user };
    delete userCopy["password"];
    return userCopy;
};

exports.getReturnableUserObject = getReturnableUserObject;