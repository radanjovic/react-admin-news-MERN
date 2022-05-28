const {MongoClient} = require('mongodb');
const URI = process.env.MONGO_URI;

// Helpers to connect to mongoDB and close connection after finishing query

const connectUsers = async() => {
    try {
        const connection = await MongoClient.connect(URI);
        const users = connection.db().collection('users');
        return [users, connection];
    } catch(err) {
        console.error(err);
    }
}
const connectNews = async() => {
    try {
        const connection = await MongoClient.connect(URI);
        const news = connection.db().collection('news');
        return [news, connection];
    } catch(err) {
        console.error(err);
    } 
}

module.exports = {
    connectUsers,
    connectNews
}