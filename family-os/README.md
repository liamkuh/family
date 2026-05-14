# Family OS — Setup Instructions

## Step 1 — Add your Supabase key
Open `.env.local` and replace `PASTE_YOUR_ANON_KEY_HERE` with your actual anon key from Supabase Settings → API.

## Step 2 — Create your two user accounts in Supabase
1. Go to Supabase dashboard → Authentication → Users
2. Click "Invite user" — enter your email
3. Click "Invite user" again — enter your wife's email
4. You'll both get an email to set your passwords

## Step 3 — Deploy to Netlify
1. Go to netlify.com → "Add new site" → "Deploy manually"
2. Drag and drop the entire `family-os` folder
3. Once uploaded, go to Site Settings → Environment Variables
4. Add these two variables:
   - NEXT_PUBLIC_SUPABASE_URL = https://fryyruuvzmteazdnmgan.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = your anon key
5. Trigger a redeploy — your site is live!

## Your app URL
Netlify will give you a URL like: https://happy-family-12345.netlify.app
You can rename this to something custom in Site Settings.

## Adding to iPhone home screen
1. Open the URL in Safari on iPhone
2. Tap the Share button
3. Tap "Add to Home Screen"
4. It works like an app!
