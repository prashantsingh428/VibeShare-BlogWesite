# Deployment Guide (Render + Cloudinary)

This guide will help you deploy your VibeShare app to the internet so anyone can use it.

## Prerequisites
*   [GitHub Account](https://github.com) (You have this)
*   [Cloudinary Account](https://cloudinary.com) (Free)
*   [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (Free)
*   [Render Account](https://render.com) (Free)

---

## Step 1: Set up Cloudinary (For Images)
1.  Log in to [Cloudinary](https://cloudinary.com/console).
2.  On the **Dashboard**, you will see your "Product Environment Credentials":
    *   **Cloud Name**
    *   **API Key**
    *   **API Secret**
3.  Keep these safe, you will need them for step 4.

## Step 2: Set up MongoDB Atlas (For Database)
1.  Create a cluster (Free Tier) on MongoDB Atlas.
2.  Whitelist IP: Go to "Network Access" -> "Add IP Address" -> **Allow Access from Anywhere** (`0.0.0.0/0`).
3.  Create User: Go to "Database Access" -> Create a new user (remember password).
4.  Get URL: Click "Connect" -> "Drivers" -> Copy the string (e.g., `mongodb+srv://user:<password>@cluster...`).
5.  Replace `<password>` with your actual password. **This is your MONGO_URI**.

## Step 3: Deploy to Render
1.  Log in to [Render](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Select "Build and deploy from a Git repository" -> Connect your **VibeShare-BlogWesite** repo.
4.  **Settings**:
    *   **Name**: `vibeshare-app` (or whatever you like)
    *   **Region**: Closest to you (e.g., Singapore/Ohio)
    *   **Branch**: `main`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Instance Type**: Free

## Step 4: Environment Variables (Crucial!)
Scroll down to **Environment Variables** and add these key-value pairs:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | *(Your MongoDB connection string from Step 2)* |
| `JWT_SECRET` | *(Any long random password, e.g. supersecretkey123)* |
| `CLOUDINARY_CLOUD_NAME` | *(From Step 1)* |
| `CLOUDINARY_API_KEY` | *(From Step 1)* |
| `CLOUDINARY_API_SECRET` | *(From Step 1)* |

## Step 5: Finish
1.  Click **Create Web Service**.
2.  Wait for the build to finish.
3.  Render will give you a URL (e.g., `https://vibeshare.onrender.com`).
4.  **Done!** Share that link with everyone.
