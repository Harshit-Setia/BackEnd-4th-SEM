const fs = require('fs');
let userDataFilePath = './DB/userData.json';


// read user
const readUserDataFromFile = () => {
    try {
        if (!fs.existsSync(userDataFilePath)) {
            return [];
        }
        const data = fs.readFileSync(userDataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading user data:', error);
        return [];
    }
};

// auth
const authenticate = (req, res, next) => {
    const { email, password } = req.body;
    const users = readUserDataFromFile();
    if (!Array.isArray(users)) {
        return res.status(500).json({ message: "Internal server error: User data format invalid."});
    }
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Access denied. Invalid credentials." });
    }
    req.user = user;
    next();
};

module.exports = { authenticate };