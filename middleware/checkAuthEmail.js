import jwt from 'jsonwebtoken';

export const checkAuthEmail = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    console.log(token);
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            console.log(decoded);
            req.userId = decoded._id;
            req.isAuthenticated = true; // Пользователь авторизован
        } catch (err) {
            console.log(err);
            req.isAuthenticated = false; // Пользователь не авторизован из-за недействительного токена
        }
    } else {
        req.isAuthenticated = false; // Пользователь не авторизован из-за отсутствия токена
    }
    next();
};