'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_DATA;

const { sequelize, DataTypes } = require('./index');
const users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.VIRTUAL,
    }
});

users.authBasic = async function (username, password) {
    const user = await users.findOne({ where: { username: username } });
    const validUser = await bcrypt.compare(password, user.password);
    if (validUser) {
        let newToken = jwt.sign({ username: user.username, password: user.password }, SECRET);
        user.token = newToken;
        return user;
    } else {
        throw new Error("invalid user");
    }
}

users.authBearer = async function (token){
const parsedToken=jwt.verify(token,SECRET)
const user =await users.findOne({where:{username:parsedToken.username}})
if (user.username){
    return user
}else{
    throw new Error('invalid token');
}

}
module.exports = users;
