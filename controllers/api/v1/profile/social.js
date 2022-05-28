const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const authenticateUser = require('../../../middleware/authenticateUser');
const connectUsers = require('../../../../models/connect').connectUsers;

// Update social media profiles for users - users can submit 1-4 different fields
router.route('/:userId')

.get(authenticateUser, async(req,res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);

    try {
        const user = await users.findOne({_id:id}, {facebook: 1, instagram: 1, twitter: 1, linkedin: 1});
        connection.close();
        return res.status(200).json(user);
    } catch(err) {
        connection.close();
        return res.status(404).json({error: 'User not found!'});
    }
})

.post(authenticateUser, async(req,res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);

    // If no data was submitted
    if (!req.body.fb && !req.body.insta && !req.body.twt && !req.body.lin) {
        connection.close();
        return res.status(400).json({error: 'Add at least one field!'});
    }

    let obj = {}

    req.body.fb && (obj.facebook = req.body.fb);
    req.body.insta && (obj.instagram = req.body.insta);
    req.body.twt && (obj.twitter = req.body.twt);
    req.body.lin && (obj.linkedin = req.body.lin);

    try {
        const user = await users.updateOne({_id:id}, {$set: obj});
        if (!user) {
            connection.close();
            return res.status(401).json({error: 'User not found'});
        }
        connection.close();
        return res.status(200).json({message: "Successfully updated social media fields"});
    } catch(err) {
        connection.close();
        return res.status(403).json({error: 'Something went wrong!'});
    }
});

module.exports = router;