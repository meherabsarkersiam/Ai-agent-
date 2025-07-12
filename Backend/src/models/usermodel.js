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
    minlength: [8, "Password must be at least 8 characters long"]
  },
  verifyToken: {
    type: String
  }
});

// 🔐 Encrypt password (static)
userschema.statics.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 🔍 Find by Email (static)
userschema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// ✅ Generate Verify Token (static)
userschema.statics.GenVerifyToken = function (email) {
  if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY not found");
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "10m" });
};

// 🔐 Compare Password (instance)
userschema.methods.checkPassword = function (receivedPassword) {
  return bcrypt.compare(receivedPassword, this.password);
};

// 🔐 Generate Auth Token (instance)
userschema.methods.GenToken = function () {
  if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY not found");
  return jwt.sign(
    { email: this.email },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
    };



export const User = mongoose.model("User", userschema);

export default User