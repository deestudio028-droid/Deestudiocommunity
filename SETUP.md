# DeeStudio Community Platform - Complete Setup Guide

Welcome to the official setup guide for the DeeStudio Community Platform. This document provides a founder-friendly, step-by-step checklist to take your project from a local codebase to a live, production-ready community hub.

---

## 1. SUPABASE SETUP

Supabase handles your database, authentication, file storage, and real-time updates.

### Step 1: Create a Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Choose a region close to your target audience.
3. Save your database password securely.

### Step 2: Get Your API Keys
1. In your Supabase dashboard, go to **Project Settings** (the gear icon) > **API**.
2. Find the **Project URL** and the **anon / public key**. You will need these for your environment variables.

### Step 3: Run the SQL Schema
1. Go to the **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Paste the complete SQL from `supabase_schema.sql` (which includes all tables, triggers, buckets, and policies).
4. Click **Run**.
5. **Verify**: Go to the **Table Editor** to ensure tables like `community_members` and `pending_applications` exist.

### Step 4: Enable Realtime
1. In the Supabase dashboard, go to **Database** > **Publications**.
2. The SQL script already created a `supabase_realtime` publication, but verify that `community_members`, `community_ideas`, `community_challenges`, and `community_stats` are toggled **ON** for Realtime.

### Step 5: Verify Storage Buckets
1. Go to **Storage**.
2. Verify that two buckets exist: `community-uploads` (public) and `subscription-screenshots` (private).

---

## 2. ENVIRONMENT VARIABLES

In the root of your project folder, create a file named `.env.local` and paste the following:

```env
# Your Supabase Project URL (found in Settings > API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase Anon Key (found in Settings > API)
VITE_SUPABASE_ANON_KEY=your-anon-key

# The URL to your Google Form for new applicants
VITE_GOOGLE_FORM_URL=https://forms.gle/V58BsJF3HckZvPvk7

# The base URL for your backend API (where the subscriber count is fetched)
VITE_API_BASE_URL=http://localhost:3000
```

*Note: Variables prefixed with `VITE_` are safely exposed to the frontend. Never expose service role keys here.*

---

## 3. YOUTUBE SUBSCRIBER API SETUP

To fetch live subscriber counts safely, you need a backend endpoint (`/api/subscribers`).

### Step 1: Get YouTube API Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Search for **YouTube Data API v3** and **Enable** it.
4. Go to **Credentials** > **Create Credentials** > **API Key**.
5. Find your **Channel ID** (from your YouTube advanced account settings).

### Step 2: Backend Architecture
*Do not call the YouTube API from the React frontend, as it will expose your API key.*
Instead, create a simple Node.js/Express server (or a Next.js API route/Serverless function) that looks like this:

```javascript
// Example Express Backend
app.get('/api/subscribers', async (req, res) => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  
  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
  const data = await response.json();
  
  res.json({ count: data.items[0].statistics.subscriberCount });
});
```

### Step 3: Frontend Consumption
The `useSubscribers` hook is already wired to fetch from `/api/subscribers`. Make sure your `VITE_API_BASE_URL` points to where your backend is hosted.

---

## 4. STORAGE SETUP

Your SQL schema automatically created the required buckets and policies. 

### `community-uploads`
- **Purpose**: Profile images, attachments.
- **Permissions**: Publicly readable. Authenticated users can upload, update, and delete their own files.

### `subscription-screenshots`
- **Purpose**: Proof of YouTube subscription.
- **Permissions**: Private. Users can upload, but ONLY Admins can view or delete. Public reading is blocked.

**Testing**: You can test this by uploading a file manually via the Supabase Storage UI, or implementing the upload function using `supabase.storage.from('bucket-name').upload()`.

---

## 5. REALTIME SETUP

Realtime is crucial for the "alive" feeling of the Wall.

### Verification
1. Ensure the `supabase_realtime` publication covers the required tables.
2. **To Test**: Open your deployed Wall page in one browser window. In the Supabase Table Editor, manually edit a member's name or add a new approved member. You should see the Wall page update instantly without refreshing.

---

## 6. FIRST MEMBER TEST

Let's add Deepak (DS-001) to the Wall manually to verify everything is working.

1. Go to the Supabase **Table Editor**.
2. Select `community_members`.
3. Click **Insert row**.
4. Fill in the data:
   - `full_name`: Deepak
   - `country`: Your Country
   - `approved`: TRUE
   *(Leave `ds_id` empty. The trigger will automatically generate it!)*
5. Click **Save**.

### Verify on the Frontend
- **Wall Page**: Check if the card appears instantly.
- **Badge Generation**: Because they are member #1, the badge should read **Founder Member**.
- **Search**: Type "Deepak" or "DS-001" to see if filtering works.
- **Modal**: Click the card to ensure the animated profile modal opens correctly.

---

## 7. ADMIN APPROVAL FLOW

### Current Flow (Manual Automation)
1. **Apply**: User fills out the Google Form (link provided in CTA).
2. **Review**: Admin reviews responses (and checks the screenshot).
3. **Approve**: Admin goes to Supabase and inserts the approved user into `community_members` (or updates `pending_applications` to 'approved').
4. **Trigger**: The PostgreSQL trigger generates the `DS-XXX` ID automatically.
5. **Realtime**: The Wall updates instantly.

### Future Automation
You can connect Google Forms to a service like Zapier or Make.com. When a form is submitted, it can automatically insert a row into the `pending_applications` table. You can then build an Admin Dashboard in React to click "Approve", which updates the status and fires the ID generation trigger automatically.

---

## 8. LOCAL DEVELOPMENT

To run the platform on your local machine:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Expected Result*: Vite will start a local server (usually `http://localhost:5173`). You can view your site with hot module replacement.
3. **Build for Production**:
   ```bash
   npm run build
   ```
   *Expected Result*: Compiles Tailwind and React into optimized static files in the `dist/` folder.
4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
   *Expected Result*: Serves the `dist/` folder locally so you can verify the final optimized site before deployment.

---

## 9. DEPLOYMENT

For a React Vite app, **Vercel** or **Netlify** are highly recommended.

1. Push your code to a GitHub repository.
2. Import the project into Vercel/Netlify.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**: Make sure to copy the values from your `.env.local` into the platform's Environment Variables settings before deploying!

---

## 10. FINAL VERIFICATION CHECKLIST

Before announcing the platform to your subscribers, run through this checklist:

- [ ] Homepage loads perfectly and animations are smooth.
- [ ] Wall page loads with the correct emotional aesthetic.
- [ ] Supabase is connected (no console errors).
- [ ] Realtime is working (test by adding a member in the DB).
- [ ] Subscriber count is working (or safely mocked).
- [ ] DS IDs are visible and correctly formatted (DS-001).
- [ ] Search filtering works by Name and DS ID.
- [ ] Member Profile Modal opens and closes properly.
- [ ] The "Claim Your DS ID" button links to the correct Google Form.
- [ ] The production build succeeds (`npm run build`).

Welcome to the beginning of the DeeStudio journey. Running On Comments & Hope 🚀
