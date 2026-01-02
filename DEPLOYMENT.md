# Deploy to Railway - Step by Step Guide

## Step 1: Prepare Your Code

✓ Your backend is already set up and ready to deploy!

## Step 2: Create Railway Account

1. Go to https://railway.app/
2. Click "Login" and sign in with GitHub
3. Authorize Railway to access your GitHub account

## Step 3: Deploy Backend to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   cd Backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js and deploy

### Option B: Deploy Directly (Easier)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Deploy from Backend folder:**
   ```bash
   cd Backend
   railway init
   railway up
   ```

## Step 4: Configure Environment Variables

1. In Railway dashboard, go to your project
2. Click "Variables" tab
3. Add these variables:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

Note: SQLite database will work automatically - no separate database setup needed!

## Step 5: Get Your Backend URL

1. In Railway dashboard, go to "Settings"
2. Click "Generate Domain" to get your public URL
3. Your backend URL will be something like: `https://your-app.up.railway.app`

## Step 6: Deploy Frontend

### Option A: Railway (Host both on Railway)

1. Go to Railway dashboard
2. Click "New Project" → "Empty Project"
3. Add "New Service" → Deploy from GitHub (your frontend repo)
4. Railway will host your static files

### Option B: Netlify/Vercel (Easier for static sites)

**Using Netlify:**
1. Go to https://www.netlify.com/
2. Drag and drop your entire project folder
3. Site will be live instantly!

**Using Vercel:**
1. Go to https://vercel.com/
2. Import your GitHub repo or drag folder
3. Deploy!

## Step 7: Update Frontend with Backend URL

After deploying backend, update Contact.html with your Railway backend URL:

In Contact.html, find:
```javascript
fetch('http://localhost:3000/api/contact', {
```

Replace with:
```javascript
fetch('https://your-app.up.railway.app/api/contact', {
```

## Step 8: Test Everything

1. Visit your deployed website
2. Fill out the contact form
3. Submit and check for success message
4. Verify data saved: Visit `https://your-app.up.railway.app/api/contacts`

## Costs

- **Railway:** Free tier includes:
  - $5 credit per month
  - ~500 hours of usage
  - Perfect for small projects

- **Netlify/Vercel:** Free tier is generous for static sites

## Troubleshooting

**"Failed to submit form"**
- Check CORS is enabled in server.js (already configured)
- Verify backend URL is correct in Contact.html
- Check Railway logs for errors

**Database not saving**
- Railway automatically creates portfolio.db
- Check Railway logs: `railway logs`

**Backend sleeping**
- Free tier apps sleep after inactivity
- First request may be slow (cold start)
- Upgrade to Hobby plan for always-on

## Commands Reference

```bash
# View logs
railway logs

# Check deployment status
railway status

# Link to existing project
railway link

# Open project in browser
railway open
```

Your website will be live at a custom URL! 🚀
