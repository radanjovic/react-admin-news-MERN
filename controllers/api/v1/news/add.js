const express = require('express');
const router = express.Router();
const authenticateUser = require('../../../middleware/authenticateUser');
const connectNews = require('../../../../models/connect').connectNews;

router.post('/', authenticateUser, async(req,res) => {
    const [news, connection] = await connectNews();
    const {owner, title, description, content, author, date, time, categories, published, showAuthorName, dateTime} = req.body;
   
    const obj = {
        owner, title, description, content, author, date, time, categories, published, showAuthorName, dateTime
    }

    req.body.images && (obj.images = req.body.images);

    try {
        const post = await news.insertOne(obj);
        connection.close();
        return res.json({message: 'Successfully created new post!'});
    } catch(err) {
        connection.close();
        return res.json({error: 'Something went wrong. Please try again later'});
    }
});

module.exports = router;