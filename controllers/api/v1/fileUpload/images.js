const express = require('express');
const authenticateUser = require('../../../middleware/authenticateUser');
const router = express.Router();
const {v4: uuid} = require('uuid');

router.post('/', authenticateUser, (req,res) => {
    const files = req.files;
    const keys = Object.keys(files);

    if (!files || !keys) {
        return res.status(404).json({error: 'Not found images'});
    }
    
    let images = [];
    keys.forEach(key => images.push(files[key]));

    let urls = [];
    const path = ('/static/images/posts/');

    images.forEach(image => {
        const name = (uuid() + image.name);
        image.mv((process.cwd() + (path+name)), (err) => {
            if (err) return res.status(500).json({error: 'Could not save image!'});
        });
        urls.push(`${process.env.DOMAIN}${path+name}`);
    });
    
    return res.status(200).json({urls});
});

module.exports = router;
