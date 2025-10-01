import jwt from 'jsonwebtoken';
import 'dotenv/config';

const userAuth = async (req, res, next) => {
    const token = req.headers.token; 

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id }; 
            next(); 
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default userAuth;
