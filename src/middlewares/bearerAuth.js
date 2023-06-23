'use strict';
const base64 = require('base-64');
const Users = require('../models/users.model');
const users = require('../models/users.model');

function bearer (req,res,next){
    if (req.headers.authorization){
        const bearerHeaderToken=req.headers.authorization.split(' ')[1];
        users.authBearer(bearerHeaderToken).then((data)=>{
            req.user=data;
            next();
        }).catch(()=>{
            next('invalid token');
        })
    }
}

module.exports=bearer;