const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const authenticateUser = require('../../../middleware/authenticateUser');
const connectUsers = require('../../../../models/connect').connectUsers;

router.route('/:userId')

.get(authenticateUser, async(req,res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);

    try {
        const user = await users.findOne({_id: id}, {username: 1, name: 1, image: 1, email: 1, company: 1});
        connection.close();
        return res.status(200).json(user);
    } catch(err) {
        connection.close();
        return res.status(404).json({error:'User not found'});
    }
})

.post(authenticateUser, async(req, res) => {
    const [users, connection] = await connectUsers();
    const id = ObjectId(req.params.userId);
    const {oldUsername, oldName, oldImage} = req.body;

    let obj = {};
    let newUser = {
        id: req.user.id,
    }

    if (req.body.username) {
        const alreadyTaken = await users.findOne({username: req.body.username});
        if (alreadyTaken) {
            connection.close();
            const oldUser = {
                id: req.user.id,
                username: oldUsername,
                name: oldName,
                image: oldImage
            }
            return res.json({error: 'Username already taken!', user: oldUser});
        } else {
            obj.username = req.body.username;
            newUser.username = req.body.username;
        }
    } else {
        newUser.username = oldUsername;
    }

    req.body.name && (obj.name = req.body.name);
    req.body.email && (obj.email = req.body.email);
    req.body.image && (obj.image = req.body.image);
    req.body.company && (obj.company = req.body.company);

    req.body.name ? (newUser.name = req.body.name) : (newUser.name = oldName);
    req.body.image ? (newUser.image = req.body.image) : (newUser.image = oldImage);

    try {
        const user = await users.updateOne({_id: id}, {$set: obj});
        if (!user) {
            connection.close();
            return res.status(401).json({error: 'User not found'});
        }
        connection.close();
        return res.status(200).json({message: "Successfully updated selected fields", user: newUser});
    } catch(err) {
        connection.close();
        return res.status(403).json({error: 'Something went wrong!'});
    }
});

module.exports = router;