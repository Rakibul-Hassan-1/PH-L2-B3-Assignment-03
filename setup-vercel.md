# 🚀 Vercel Deployment Setup Guide

## ⚠️ **Current Issue: MongoDB Connection Missing**

Your API is deployed but failing because it can't connect to MongoDB.

## 🔧 **Fix: Set Environment Variables in Vercel**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/rakibul-hassan-1s-projects/assignment-03
2. Click **Settings** (gear icon)
3. Click **Environment Variables**

### **Step 2: Add MongoDB Connection String**
- **Name**: `MONGODB_URI`
- **Value**: `mongodb+srv://username:password@cluster.mongodb.net/library_management`
- **Environment**: Production ✅
- **Click Save**

### **Step 3: Redeploy**
After saving, redeploy your project:
```bash
vercel --prod
```

## 🌐 **Get MongoDB Connection String**

### **Option A: MongoDB Atlas (Free)**
1. Go to: https://cloud.mongodb.com/
2. Sign up for free account
3. Create free cluster
4. Get connection string

### **Option B: Local MongoDB**
If you have MongoDB running locally:
```
MONGODB_URI=mongodb://localhost:27017/library_management
```

## 🧪 **Test After Setup**

Once environment variables are set:
- **Health Check**: https://your-app.vercel.app/health
- **Books API**: https://your-app.vercel.app/api/books
- **Root**: https://your-app.vercel.app/

## 📋 **Required Environment Variables**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management
NODE_ENV=production
```

## 🎯 **Expected Result**

After setting environment variables, your API should work perfectly! 🚀
