const express = require('express');
const authenticateUser = require('../../../middleware/authenticateUser');
const router = express.Router();
const {v4: uuid} = require('uuid');

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

router.post('/', authenticateUser, (req,res) => {
    const image = req.files.image;

    if (!req.files || !image) {
        return res.status(404).json({error: 'Image not found!'});
    }

    if (image.size > 819200) {
        return res.status(413).json({error: 'Image size too big!'});
    }

    if (!allowedMimeTypes.includes(image.mimetype)) {
        return res.status(415).json({error: 'Image type not allowed!'})
    }

    const path = ('/static/images/users/');
    const name = (uuid() + image.name);

    image.mv((process.cwd() + (path+name)), (err) => {
        if (err) return res.status(500).json({error: 'Could not save image!'});
    });
    
    return res.status(200).json({url: `${process.env.DOMAIN}${path+name}`});
});

module.exports = router;
