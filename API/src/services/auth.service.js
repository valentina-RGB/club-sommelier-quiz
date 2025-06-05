const { Admin } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

class AuthService {

    constructor() { }

    async login(email, password) {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            const error = new Error("The admin does not exist");
            error.statusCode = 404;
            throw error;
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            SECRET_KEY,
            { expiresIn: "10h" }
        );

        return { success: true, message: "Successful login", token, admin };
    }
}

module.exports = AuthService;