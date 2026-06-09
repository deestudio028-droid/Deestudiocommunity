# Google Form to Supabase Automation

This guide explains how to connect your DeeStudio Google Form directly to your Supabase database using Google Apps Script. 

Once connected, every new submission will automatically appear in your Admin Dashboard under **Pending Applications**, where you can review and approve them with one click.

---

## 1. The Google Apps Script Code

Copy the complete code below. You will paste this into the Google Apps Script editor in the next steps.

```javascript
/**
 * DeeStudio Community - Google Form to Supabase Integration
 * Trigger: On Form Submit
 */

// ==========================================
// CONFIGURATION
// ==========================================
// Replace with your actual Supabase details
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

function onFormSubmit(e) {
  try {
    // Ensure there is a response
    if (!e || !e.response) {
      console.error("No event data. Ensure script is running via 'On form submit' trigger.");
      return;
    }

    // 1. Extract values from the form response
    const itemResponses = e.response.getItemResponses();
    let data = {
      full_name: '',
      youtube_username: '',
      email: e.response.getRespondentEmail() || '', // If form collects email automatically
      country: '',
      why_join: '',
      subscription_screenshot_url: '',
      status: 'pending'
    };

    for (let i = 0; i < itemResponses.length; i++) {
      let title = itemResponses[i].getItem().getTitle().toLowerCase();
      let answer = itemResponses[i].getResponse();

      if (title.includes('name') && !title.includes('youtube')) data.full_name = answer;
      else if (title.includes('youtube')) data.youtube_username = answer;
      else if (title.includes('email') && data.email === '') data.email = answer;
      else if (title.includes('country')) data.country = answer;
      else if (title.includes('why')) data.why_join = answer;
      else if (title.includes('screenshot') || title.includes('upload')) {
        // If it's a file upload, answer is an array of Drive file IDs
        if (Array.isArray(answer) && answer.length > 0) {
           data.subscription_screenshot_url = 'https://drive.google.com/open?id=' + answer[0];
        } else {
           // Fallback if they pasted a link
           data.subscription_screenshot_url = answer;
        }
      }
    }

    // Ensure we have at least an email and name
    if (!data.email || !data.full_name) {
       console.error("Missing critical fields (Name or Email). Submission skipped.");
       return;
    }

    // 2. Duplicate Protection Check
    // We check if this email already exists in pending_applications
    const checkUrl = `${SUPABASE_URL}/rest/v1/pending_applications?email=eq.${encodeURIComponent(data.email)}`;
    const checkOptions = {
      method: 'get',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      muteHttpExceptions: true
    };
    
    const checkResponse = UrlFetchApp.fetch(checkUrl, checkOptions);
    if (checkResponse.getResponseCode() === 200) {
      const existing = JSON.parse(checkResponse.getContentText());
      if (existing && existing.length > 0) {
        console.warn(`Duplicate Application Blocked: An application for ${data.email} already exists.`);
        return; // Stop execution to prevent spam
      }
    }

    // 3. Send POST request to Supabase
    const insertUrl = `${SUPABASE_URL}/rest/v1/pending_applications`;
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal' // Reduces bandwidth by not asking for the inserted row back
      },
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(insertUrl, options);
    const responseCode = response.getResponseCode();
    
    // 4. Error Logging
    if (responseCode >= 400) {
      console.error(`Supabase Insert Error [${responseCode}]: ${response.getContentText()}`);
    } else {
      console.log(`Success: Application successfully pushed for ${data.full_name}`);
    }

  } catch (error) {
    console.error(`Fatal Script Error: ${error.message}`);
  }
}
```

---

## 2. Setup & Deployment Steps

Follow these exact steps to deploy the script securely inside your existing Google Form:

### Open the Script Editor
1. Open your DeeStudio Google Form.
2. In the top right corner, click the **three dots** (More).
3. Select **Script editor**. This opens a new Google Apps Script project attached to your form.

### Add the Code
1. Rename the project at the top left from "Untitled project" to **"DeeStudio Form Automation"**.
2. Delete any existing code in `Code.gs`.
3. Paste the complete code block provided above.
4. **Important**: Change `YOUR_PROJECT_ID` and `YOUR_SUPABASE_ANON_KEY` at the top of the code to your actual Supabase credentials. 
   *(Because your RLS policies correctly secure the table allowing public inserts but restricting reads, the Anon Key is perfectly safe to use here).*
5. Click the **Save** icon (floppy disk).

### Setup the Automatic Trigger
1. In the left sidebar of the Script Editor, click the **Triggers** icon (it looks like an alarm clock).
2. Click the blue **+ Add Trigger** button in the bottom right.
3. Configure the trigger as follows:
   - **Choose which function to run:** `onFormSubmit`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From form`
   - **Select event type:** `On form submit`
4. Click **Save**.
5. Google will pop up an authorization window. It may warn you that the app isn't verified. Click **Advanced**, then click **Go to DeeStudio Form Automation (unsafe)**, and **Allow** the permissions.

---

## 3. Testing Steps

Let's verify it works end-to-end:

1. Go to your live Google Form link and submit a dummy application (e.g., Name: `Test User`, Email: `test@deestudio.com`).
2. Log into your **DeeStudio Admin Dashboard**.
3. Navigate to **Applications**. 
4. The new application should immediately appear in the list! 
5. Click **Approve**, and watch them instantly get their `DS-XXX` ID and appear on the live Wall!
6. Submit *another* application using the exact same email address (`test@deestudio.com`) and verify that it does *not* appear in the dashboard (Duplicate Protection).

---

## 4. Troubleshooting Guide

If an application doesn't show up in the Admin Dashboard:

1. **Check Script Executions:**
   - In the Apps Script Editor, click the **Executions** icon (looks like a bulleted list) in the left sidebar.
   - You will see a list of every time the form was submitted.
   - Click on a "Failed" or "Completed" run to read the console logs.
2. **Missing Fields:**
   - Ensure the `includes('word')` logic in the script matches your actual Google Form question titles. If you ask "What is your country?", the script's `title.includes('country')` will catch it. If you asked "Where are you from?", you need to update the script to `.includes('where are you from')`.
3. **HTTP Errors in Logs:**
   - If the log shows `Supabase Insert Error [401]`, your Anon Key is incorrect.
   - If the log shows `Supabase Insert Error [403]`, your Row Level Security (RLS) policy for `pending_applications` is blocking inserts. Verify you ran the `CREATE POLICY "Public can insert pending applications" ...` command.
