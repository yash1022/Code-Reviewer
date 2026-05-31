import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    const SECRET = process.env.JWT_SECRET;
    return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
};

export default generateToken;



