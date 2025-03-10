import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        req.user = { id: decoded.id }; // Attach userID to req.user instead of req.body
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: " + error.message });
    }
};

export default userAuth;