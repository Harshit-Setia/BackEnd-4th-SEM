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
        console.error("Error reading user data:", error);
        return [];
    }
};

// write user
const writeUserDataToFile = (users) => {
    try {
        console.log("userDataFilePath:", userDataFilePath); // Add this line
        fs.writeFileSync(userDataFilePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing user data:", error);
    }
};

// all user
const display = (req, res) => {
    res.send(readUserDataFromFile());
};

// register user
const registerUser = (req, res) => {
    try {
        const { username, email, password } = req.body;
        const users = readUserDataFromFile();
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const newUser = { username, email, password }; // Plain text password storage
        users.push(newUser);
        writeUserDataToFile(users);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// login user
const loginUser = (req, res) => {
    try {
        const { email, password } = req.body;
        const users = readUserDataFromFile();
        const user = users.find(user => user.email === email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (password !== user.password) { // Plain text password comparison
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    display,
    registerUser,
    loginUser,
};