const express = require('express');
const router = express.Router();
const connectUsers = require('../../../../models/connect').connectUsers;
const bcrypt = require('bcrypt');

// Registering users - there is no frontend for this, but normal requests
// via Postman/ThunderClient can be sent with fields: username, password, 
// and name, to create new users!
router.route('/')
.post(async(req,res) => {
    const {username, password, name, } = req.body;
    const [users, connection] = await connectUsers();

    if (!username || !password || !name) {
        connection.close();
        return res.status(400).json({ error: "All fields are required" });
    }

    // No duplicate users
    const userExists = await users.findOne({username});
    if (userExists) {
        connection.close();
        return res.sendStatus(409);
    }

    try {
        const hashPw = await bcrypt.hash(password, 10);
        const result = await users.insertOne({
            "username": username,
            "password": hashPw,
            "name": name,
            "refreshToken": ""
        });
        connection.close();
        return res.status(201).json({message: "Success! New user created succesfully"});
    } catch(err) {
        connection.close();
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;