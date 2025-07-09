import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    password: {
        type: String, 
        required: true,
        
        minlength: [6, "Password must be at least 8 characters long"]
    },
    verifyToken: {
        type: String
    }
});

// Hash password
userschema.statics.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Check password
userschema.methods.checkPassword = async function (receivedPassword) {
    return await bcrypt.compare(receivedPassword, this.password);
};
//generate verify token
userschema.statics.GenVerifyToken = function (name) {
    const token = jwt.sign({name},process.env.SECRET_KEY);
    return token
}

// Generate JWT
userschema.methods.GenToken = function () {
    return jwt.sign(
        { email: this.email},
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
    );
};

// Find by email
userschema.statics.findByEmail = async function (email) {
    return await this.findOne({ email });
};

export const User = mongoose.model("User", userschema);
