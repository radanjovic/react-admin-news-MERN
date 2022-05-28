const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // no auth token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token, but also 403 means on frontend (custom hooks) to try and get new access token with refresh token
            req.user = decoded.user;
            next();
        }
    );
}

module.exports = authenticateUser;