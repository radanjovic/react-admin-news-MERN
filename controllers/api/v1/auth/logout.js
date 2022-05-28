const express = require('express');
const router = express.Router();
const connectUsers = require('../../../../models/connect').connectUsers;

// Logging users out
router.route('/')
.get(async(req,res) => {
    const [users,connection] = await connectUsers();
    const cookies = req.cookies;

    if (!cookies?.refreshtoken) {
        connection.close();
        return res.sendStatus(204);
    }

    const refreshToken = cookies.refreshtoken;
    
    const user = await users.findOne({refreshToken});

    // If user - delete token from db
    if (user) {
        try {
            await users.updateOne({_id: user._id}, {$set: {refreshToken: ""}});
        } catch(err) {
            return res.status(500).json(err);
        }
    }

    // In any case, clear cookie
    connection.close();
    res.clearCookie('refreshtoken', {httpOnly: true, secure: true, sameSite: 'None'});
    return res.sendStatus(204);
});

module.exports = router;