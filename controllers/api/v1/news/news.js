const express = require('express');
const router = express.Router();
const authenticateUser = require('../../../middleware/authenticateUser');
const ObjectId = require('mongodb').ObjectId;
const connectNews = require('../../../../models/connect').connectNews;


router.route('/:newsId')


.get(authenticateUser, async(req,res) => {
    const id = ObjectId(req.params.newsId);
    const [news, connection] = await connectNews();

    try {
        const post = await news.findOne({_id: id});
        if (!post) {
            connection.close();
            return res.status(404).json({error: 'News post not found!'});
        }

        connection.close();
        return res.status(200).json(post);
    }catch(err) {
        connection.close();
        return res.json({error: 'Something went wrong!'});
    }


})


.put(authenticateUser, async(req,res) => {
    const id = ObjectId(req.params.newsId);
    const [news, connection] = await connectNews();

    const {title, description, content, author, date, time, categories, published, showAuthorName, dateTime} = req.body;
   
    const obj = {
        title, description, content, author, date, time, categories, published, showAuthorName, dateTime
    }

    req.body.images && (obj.images = req.body.images);

    try {
        const post = await news.updateOne({_id: id}, {$set: obj});
        if (!post) {
            connection.close();
            return res.status(404).json({error: 'News post not found'});
        }
        connection.close();
        return res.status(200).json({message: 'Successfully updated news post'});
    } catch(err) {
        connection.close();
        return res.json({error: 'Something went wrong!'});
    }
})



.delete(authenticateUser, async(req,res) => {
    const id = ObjectId(req.params.newsId);
    const [news, connection] = await connectNews();

    try {
        const post = await news.deleteOne({_id: id});
        if (!post) {
            connection.close();
            return res.status(404).json({error: 'News post not found'});
        }
        connection.close();
        return res.status(200).json({message: `Successfully deleted one post`});
    } catch(err) {
        connection.close();
        return res.json({error: 'Something went wrong!'});
    }
});

module.exports = router;