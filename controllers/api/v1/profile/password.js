const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const authenticateUser = require('../../../middleware/authenticateUser');
const connectUsers = require('../../../../models/connect').connectUsers;

// UPdating passwords
router.post('/:userId', authenticateUser, async(req,res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);
    const {oldPw, newPw, rptPw} = req.body;

    // Server-side validation
    if (!oldPw || !newPw || !rptPw) {
        connection.close();
        return res.json({error: 'All fields are required!'});
    }
    if (newPw !== rptPw) {
        connection.close();
        return res.json({error: 'New password does not match retyped new password'});
    }

    const user = await users.findOne({_id: id});

    if (!user) {
        connection.close();
        return res.sendStatus(403);
    }

    const pwMatch = await bcrypt.compare(oldPw, user.password);

    if (!pwMatch) {
        connection.close();
        return res.json({error: 'Old password is not correct'});
    }

    try {
        const hash = await bcrypt.hash(newPw, 10);
        const result = await users.updateOne({_id: user._id}, {$set: {password: hash}});
        connection.close();
        return res.status(200).json({message: 'Successfully changed password'});
    } catch(err){ 
        connection.close();
        return res.sendStatus(500);
    }
});

module.exports = router;