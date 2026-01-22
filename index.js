/* ===================== IMPORTS ===================== */
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post");

const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

// ✅ multer
const upload = require("./config/multerconfig");


/* ===================== CONFIG ===================== */
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Database Connection
console.log("DEBUG: Checking Env Vars...");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("CLOUDINARY_CLOUD_NAME exists:", !!process.env.CLOUDINARY_CLOUD_NAME);

if (!process.env.MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is missing! The app cannot connect to the database.");
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Global Auth Middleware
app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findOne({ _id: decoded.userid });
            res.locals.user = user || null;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});


/* ===================== PUBLIC ROUTES ===================== */
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/profile/upload", isLoggedIn, (req, res) => {
    res.render("profileupload");
});


/* ===================== UPLOAD PROFILE PIC ===================== */
app.post(
    "/upload",
    isLoggedIn,
    upload.single("image"),
    async (req, res) => {

        if (!req.file) {
            return res.redirect("/profile");
        }

        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.redirect("/login");
        }

        user.profilepic = req.file.path;
        await user.save();

        res.redirect("/profile");
    }
);


/* ===================== AUTH ROUTES ===================== */
app.post("/register", async (req, res) => {
    const { email, password, username, name, age } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(409).send("User already registered");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        age,
        name,
        password: hash,
        posts: [],
        profilepic: ""
    });

    const token = jwt.sign(
        { email, userid: user._id },
        process.env.JWT_SECRET
    );

    res.cookie("token", token);
    res.redirect("/profile");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.render("login", { error: "Invalid email or password" });

    bcrypt.compare(password, user.password, (err, result) => {
        if (!result) return res.render("login", { error: "Invalid email or password" });

        const token = jwt.sign(
            { email, userid: user._id },
            process.env.JWT_SECRET
        );

        res.cookie("token", token);
        res.redirect("/profile");
    });
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});


/* ===================== PROFILE ===================== */
app.get("/profile", isLoggedIn, async (req, res) => {
    const user = await userModel
        .findOne({ email: req.user.email })
        .populate("posts");

    if (!user) {
        res.clearCookie("token");
        return res.redirect("/login");
    }

    res.render("profile", { user });
});


/* ===================== POSTS ===================== */

// Create Post
// Create Post
app.post("/post", isLoggedIn, upload.array("images", 6), async (req, res) => {
    const { content } = req.body;

    // Check if content or files exist
    if ((!content || content.trim() === "") && (!req.files || req.files.length === 0)) {
        return res.redirect("/profile");
    }

    const user = await userModel.findOne({ email: req.user.email });

    // Collect file URLs (Cloudinary returns 'path')
    let imageFiles = [];
    if (req.files && req.files.length > 0) {
        imageFiles = req.files.map(file => file.path);
    }

    const postData = {
        user: user._id,
        content: content || "",
        likes: [],
        images: imageFiles,
        image: imageFiles.length > 0 ? imageFiles[0] : "" // Backward compatibility
    };

    const post = await postModel.create(postData);

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
});

// Like / Unlike
app.get("/like/:id", isLoggedIn, async (req, res) => {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.redirect("/profile");

    const userId = req.user.userid;

    const index = post.likes.findIndex(
        id => id.toString() === userId.toString()
    );

    if (index === -1) {
        post.likes.push(userId);
    } else {
        post.likes.splice(index, 1);
    }

    await post.save();
    res.redirect("/profile");
});

// Edit Page
app.get("/edit/:id", isLoggedIn, async (req, res) => {
    const post = await postModel.findById(req.params.id);

    if (!post || post.user.toString() !== req.user.userid) {
        return res.redirect("/profile");
    }

    res.render("edit", { post });
});

// Update Post
app.post("/update/:id", isLoggedIn, async (req, res) => {
    const { content } = req.body;

    const post = await postModel.findById(req.params.id);
    if (!post || post.user.toString() !== req.user.userid) {
        return res.redirect("/profile");
    }

    post.content = content;
    await post.save();

    res.redirect("/profile");
});

// Delete Post
app.get("/delete/:id", isLoggedIn, async (req, res) => {
    const post = await postModel.findById(req.params.id);
    if (!post || post.user.toString() !== req.user.userid) {
        return res.redirect("/profile");
    }

    await userModel.updateOne(
        { _id: post.user },
        { $pull: { posts: post._id } }
    );

    await postModel.findByIdAndDelete(post._id);

    res.redirect("/profile");
});


/* ===================== AUTH MIDDLEWARE ===================== */
function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect("/login");
    }

    try {
        const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        res.clearCookie("token");
        res.redirect("/login");
    }
}


/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Live server running on ${PORT} 🍌`);
});
