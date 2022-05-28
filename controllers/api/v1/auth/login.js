const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectUsers = require('../../../../models/connect').connectUsers;

// Route for logging users in
router.route('/')
.post(async(req,res) => {
    const {username, password} = req.body;
    const [users, connection] = await connectUsers();

    // Server-side validation
    if (!username || !password) {
        connection.close();
        return res.status(400).json({"message": "Username and password are required"});
    }

    const user = await users.findOne({username});
    if (!user) {
        connection.close();
        return res.sendStatus(401);
    }

    const pwMatch = await bcrypt.compare(password, user.password);

    if (pwMatch) {

        // Create access token
        const accessToken = jwt.sign({
            "user":{
                "id":user._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'}); // valid for 10 mins

        // Create refresh token
        const refreshToken = jwt.sign({
            "user": {
                "id": user._id,
                "username": user.username,
            }
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '10d'}); // valid for 10 days

        // Save refresh token in DB for user
        await users.updateOne({_id: user._id}, {$set: {refreshToken}});

        connection.close();

        // Send refresh token safely to user/client with httpOnly cookie, valid for max 10 days
        res.cookie('refreshtoken', refreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: (10 * 24 * 60 * 60 * 1000)});

        // Send access token and user info to frontend via json
        return res.status(200).json({accessToken, user: {id:user._id, username: user.username, name:user.name, image:user.image}});

    } else {
        connection.close();
        return res.sendStatus(401);
    } 
});

module.exports = router;