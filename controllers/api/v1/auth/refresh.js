const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connectUsers = require('../../../../models/connect').connectUsers;

// Refreshing accessTokens with the help of refreshTokens
router.route('/')
.get(async(req,res) => {
   const [users, connection] = await connectUsers();
   const cookies = req.cookies;

   // No refresh token
    if (!cookies?.refreshtoken) {
        connection.close();
        return res.sendStatus(401);
    }

    const refreshToken = cookies.refreshtoken; 

    const user = await users.findOne({refreshToken});

    // No user with that token
    if (!user) {
        connection.close();
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decode) => {
        // If errors or manipulations
        if (err || String(user._id) !== decode.user.id) {
            connection.close();
            return res.sendStatus(403);
        }
        
        // If all is clear, first create new access token to send user
        const accessToken = jwt.sign({
            "user":{
                "id":user._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'}); // valid for half hour

        // Refresh token has iat and exp timeticks which are in seconds, and we need exp
        // in ms to compare
        const exp = decode.exp * 1000; //  s > ms
        const now = Date.now();

        const threeDays = 1000 * 60 * 60 * 24 * 3; // three days from now

        // If token has 'lived' for more than 7 days - meaning that there is less than
        // 3 days of time (in ms) until it expires - rotate it, if not, proceed
        if ((now+threeDays) > exp) {
            // Time to refresh
            const newRefreshToken = jwt.sign({
                user: {
                    id: user._id,
                    username: user.username,
                }
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'}); // valid for 30 days again

            // Replace old refresh token in DB  with the new one
            await users.updateOne({_id: user._id}, {$set: {refreshToken: newRefreshToken}});

            // Overwrite old cookie
            res.cookie('refreshtoken', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: (30 * 24 * 60 * 60 * 1000)});
        }

        connection.close();

        // In any case, send access token to frontend, along with user info for context (redux...)
        return res.status(200).json({accessToken, user: {id:user._id, username: user.username, name:user.name, image:user.image}});
    });
});

module.exports = router;


/* 
            WITH INCREMENTAL TOKEN ROTATION - AFTER A PERIOD OF TIME:
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connectUsers = require('../../../../models/connect').connectUsers;

// Refreshing accessTokens with the help of refreshTokens
router.route('/')
.get(async(req,res) => {
   const [users, connection] = await connectUsers();
   const cookies = req.cookies;

    if (!cookies?.refreshtoken) {
        connection.close();
        return res.sendStatus(401);
    }

    const refreshToken = cookies.refreshtoken; 

    console.log('Refresh Token: ' + refreshToken);

    const user = await users.findOne({refreshToken});

    if (!user) {
        connection.close();
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decode) => {
        // If errors or manipulations
        if (err || String(user._id) !== decode.user.id) {
            connection.close();
            return res.sendStatus(403);
        }
        
        // If all is clear, first create new access token to send user
        const accessToken = jwt.sign({
            "user":{
                "id":user._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'}); // valid for half hour

        // Refresh token has iat and exp timeticks which are in seconds, and we need exp
        // in ms to compare
        const exp = decode.exp * 1000; //  s > ms
        const now = Date.now();

        const sevenDays = 1000 * 60 * 60 * 24 * 7; // seven days from now

        // If token has 'lived for more than 23 days - meaning that there is less than
        // 7 days of time (in ms) until it expires - rotate it, if not, proceed
        if ((now+sevenDays) > exp) {
            // Time to refresh
            const newRefreshToken = jwt.sign({
                user: {
                    id: user._id,
                    username: user.username,
                }
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'}); // valid for 30 days again

            // Replace old refresh token in DB  with the new one
            await users.updateOne({_id: user._id}, {$set: {refreshToken: newRefreshToken}});

            // Overwrite old cookie
            res.cookie('refreshtoken', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: (30 * 24 * 60 * 60 * 1000)});
        } else {
            // Remove else in production
            console.log('No rotating tokens yet');
        }

        
        connection.close();

        // In any case, send access token to frontend, along with user info for context (redux...)
        return res.status(200).json({accessToken, user: {id:user._id, username: user.username, name:user.name, image:user.image}});
    });
});

module.exports = router;

*/


/* 
            WITH CONSTANT TOKEN ROTATION:
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connectUsers = require('../../../../models/connect').connectUsers;

// Refreshing accessTokens with the help of refreshTokens
router.route('/')
.get(async(req,res) => {
   const [users, connection] = await connectUsers();
   const cookies = req.cookies;

    if (!cookies?.refreshtoken) {
        connection.close();
        return res.sendStatus(401);
    }

    const refreshToken = cookies.refreshtoken; 

    console.log('Refresh Token: ' + refreshToken);

    const user = await users.findOne({refreshToken});

    if (!user) {
        connection.close();
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decode) => {
        // If errors or manipulations
        if (err || String(user._id) !== decode.user.id) {
            connection.close();
            return res.sendStatus(403);
        }
        
        // If all is clear, first create new access token to send user
        const accessToken = jwt.sign({
            "user":{
                "id":user._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'}); // valid for half hour

        // Then create new refresh token and store in db overwriting the last one
        const newRefreshToken = jwt.sign({
            "user": {
                "id": user._id,
                "username": user.username,
            }
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'}); // valid for 30 days
        await users.updateOne({_id: user._id}, {$set: {refreshToken: newRefreshToken}});
        
        connection.close();
        
        // Overwrite old cookie with new refresh token !
        res.cookie('refreshtoken', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: (30 * 24 * 60 * 60 * 1000)});

        // In any case, send access token to frontend, along with user info for context (redux...)
        return res.status(200).json({accessToken, user: {id:user._id, username: user.username, name:user.name, image:user.image}});
    });
});

module.exports = router;

*/



/* 
            WITH EXPIRING REFRESH TOKENS: 

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connectUsers = require('../../../../models/connect').connectUsers;

// Refreshing accessTokens with the help of refreshTokens
router.route('/')
.get(async(req,res) => {
   const [users, connection] = await connectUsers();
   const cookies = req.cookies;

    if (!cookies?.refreshtoken) {
        connection.close();
        return res.sendStatus(401);
    }

    const refreshToken = cookies.refreshtoken; 

    console.log('Refresh Token: ' + refreshToken);

    const user = await users.findOne({refreshToken});

    if (!user) {
        connection.close();
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        // If errors or manipulations
        if (err || String(user._id) !== decode.user.id) {
            connection.close();
            return res.sendStatus(403);
        }
        
        // If all is clear, send new access token, along with user info
        const accessToken = jwt.sign({
            "user":{
                "id":user._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'}); // valid for half hour

        connection.close();
        return res.status(200).json({accessToken, user: {id:user._id, username: user.username, name:user.name, image:user.image}});
    });
});

module.exports = router;


*/