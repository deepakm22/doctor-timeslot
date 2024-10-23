const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
const authHeader = req.headers['authorization'];

if (!authHeader) {
return res.status(401).json({ error: 'Token not provided!' });
}

const token = authHeader.split(' ')[1]; 

try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    
    req.user = decoded.id;
    req.email = decoded.email;
    req.isAdmin = decoded.isAdmin
    console.log(req.user)
    next();
    } catch (error) {
        
    return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
