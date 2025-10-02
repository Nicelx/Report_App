const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;    // Добавляем данные пользователя в запрос
        // console.log(req.user);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // console.log('token', token);
    // console.log('decoded', decoded);
    console.log('auth ok');
    next();
}