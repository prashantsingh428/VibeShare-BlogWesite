const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    age: Number,
    profilepic: {
        type: String,
        default: "default.jpg"
    },
    posts: [{                     // ✅ plural
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
