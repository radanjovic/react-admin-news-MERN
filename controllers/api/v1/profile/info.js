const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const authenticateUser = require('../../../middleware/authenticateUser');
const connectUsers = require('../../../../models/connect').connectUsers;

// Change user info
router.route('/:userId')

.get(authenticateUser, async(req, res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);

    try {
        const user = await users.findOne({_id: id}, {bio: 1, dateOfBirth: 1, website: 1, country: 1, phone: 1});
        connection.close();
        return res.status(200).json(user);
    } catch(err) {
        connection.close();
        return res.status(404).json({error: 'User not found'});
    }
})

.post(authenticateUser, async(req,res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);

    // Server-side validation
    if (!req.body.bio && !req.body.dob && !req.body.country && !req.body.site && !req.body.phone) {
        connection.close();
        return res.status(400).json({error: 'Add at least one field!'});
    }

    let obj = {}

    req.body.bio && (obj.bio = req.body.bio);
    // Just in case new Date throws an error we'll store dob as simple string, but in real-life
    // more validation can be added to store as date. 
    req.body.dob && (obj.dateOfBirth = req.body.dob);
    req.body.country && (obj.country = req.body.country);
    req.body.site && (obj.website = req.body.site);
    req.body.phone && (obj.phone = req.body.phone);

    try {
        const user = await users.updateOne({_id: id}, {$set: obj});
        if (!user) {
            connection.close();
            return res.status(401).json({error: 'User not found'});
        }
        connection.close();
        return res.status(200).json({message: "Successfully updated selected fields"});
    } catch(err) {
        connection.close();
        return res.status(403).json({error: 'Something went wrong!'});
    }
});

module.exports = router;