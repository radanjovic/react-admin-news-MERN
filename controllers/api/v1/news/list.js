const express = require('express');
const connectNews = require('../../../../models/connect').connectNews;
const authenticateUser = require('../../../middleware/authenticateUser');
const router = express.Router();

router.get('/', authenticateUser, async(req,res) => {
    const [news, connection] = await connectNews();
    try {
        const posts = await news.find({published: true}, {owner: 1, title: 1, dateTime: 1, date: 1, time: 1}).sort({dateTime: -1}).toArray();
        connection.close();
        return res.json(posts);

    } catch(err) {
        connection.close();
        return res.json({error: 'Something went wrong. Please try again later'});
    }
});

module.exports = router;