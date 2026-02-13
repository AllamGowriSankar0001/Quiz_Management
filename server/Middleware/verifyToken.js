const JWT = require("jsonwebtoken");
const verify = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const verifytoken = JWT.verify(token, process.env.JWTSECRETKEY);
        req.user = verifytoken;
        next();
    } catch (err) {
        res.status(500).json({ message: "Error happend", Error: err.message });
    }
};
module.exports = verify;
