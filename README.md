# 📸 VibeShare - Social Blog Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

VibeShare is a modern, high-performance social blogging application built for enthusiasts to share their moments, thoughts, and high-quality media. It focuses on a clean user experience with robust media handling and seamless interaction.

---

## 🚀 Key Features

- **🛡️ Secure Authentication**: JWT-based authentication with cookie storage and password hashing using Bcrypt.
- **📝 Rich Post Creation**: Support for multi-image uploads (up to 6 images per post) and textual content.
- **🖼️ Profile Management**: Personalized profiles with dynamic profile pictures and user bio data updates.
- **💖 Social Interaction**: Like/Unlike system for posts to engage with the community.
- **☁️ Cloud-Native Media**: Integrated with Cloudinary for optimized image storage and delivery.
- **📱 Responsive Design**: Fully responsive UI designed with EJS and custom CSS for a premium feel.

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Frontend**: [EJS (Embedded JavaScript templates)](https://ejs.co/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Media Hosting**: [Cloudinary](https://cloudinary.com/)
- **File Uploads**: [Multer](https://www.npmjs.com/package/multer), [Multer-Storage-Cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)

---

## 📂 Project Structure

```bash
├── config/           # Configuration files (Multer, etc.)
├── models/           # Mongoose Schemas (User, Post)
├── public/           # Static assets (CSS, Images, JS)
├── views/            # EJS Templates (Auth, Profile, Feed)
├── index.js          # Main Application Entry Point
└── render.yaml       # Deployment configuration for Render
```

---

## ⚙️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prashantsingh428/VibeShare-BlogWesite.git
   cd VibeShare-BlogWesite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

---

## 🌩️ Deployment

The project is pre-configured for deployment on **Render** using the included `render.yaml` and `DEPLOY.md` guides.

---

## 🛡️ License

This project is licensed under the **ISC License**.

---

Designed with ❤️ by [Prashant Singh](https://github.com/prashantsingh428)
