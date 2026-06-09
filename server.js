import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' }); // Load local env for testing

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// SUPABASE ADMIN CLIENT
// ---------------------------------------------------------
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Admin endpoints will fail.');
}

// ---------------------------------------------------------
// RATE LIMITING
// ---------------------------------------------------------
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: true, message: 'Too many admin requests, please try again later.' }
});

// ---------------------------------------------------------
// ADMIN MIDDLEWARE
// ---------------------------------------------------------
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return res.status(500).json({ error: true, message: 'Server configuration error: Admin password not set.' });
  }

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: true, message: 'Unauthorized. Incorrect admin password.' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: true, message: 'Server configuration error: Supabase Service Role Key missing.' });
  }

  next();
};

// ---------------------------------------------------------
// HELPER: LOG ACTIVITY
// ---------------------------------------------------------
const logAdminActivity = async (action, targetId, targetName) => {
  if (!supabaseAdmin) return;
  try {
    await supabaseAdmin.from('admin_activity_logs').insert({
      action,
      target_id: targetId,
      target_name: targetName,
      performed_by: 'Admin'
    });
  } catch (err) {
    console.error('Failed to log admin activity:', err);
  }
};

// ---------------------------------------------------------
// IN-MEMORY CACHE
// ---------------------------------------------------------
let cache = {
  count: 39,
  timestamp: 0,
};
const CACHE_DURATION_MS = 10 * 60 * 1000;

// ---------------------------------------------------------
// PUBLIC ENDPOINTS
// ---------------------------------------------------------
app.get('/api/subscribers', async (req, res) => {
  const now = Date.now();
  if (now - cache.timestamp < CACHE_DURATION_MS && cache.timestamp !== 0) {
    return res.json({ count: cache.count });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    return res.json({ count: cache.count, error: true, message: 'Missing API credentials.' });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API failed`);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const liveCount = parseInt(data.items[0].statistics.subscriberCount, 10);
      cache = { count: liveCount, timestamp: now };
      return res.json({ count: liveCount });
    } else {
      throw new Error('Channel not found');
    }
  } catch (error) {
    return res.json({ count: cache.count, error: true });
  }
});

// ---------------------------------------------------------
// SECURE ADMIN ENDPOINTS
// ---------------------------------------------------------

// 1. Verify Login
app.post('/api/admin/login', adminLimiter, (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;
  
  if (password === adminPassword) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Invalid password' });
});

// 2. Get Dashboard Stats
app.get('/api/admin/dashboard-stats', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const [appsPending, membersAppr, stats] = await Promise.all([
      supabaseAdmin.from('pending_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('community_members').select('*', { count: 'exact', head: true }).eq('approved', true),
      supabaseAdmin.from('community_stats').select('*')
    ]);

    const statsObj = {};
    if (stats.data) {
      stats.data.forEach(s => { statsObj[s.key] = s.value; });
    }

    res.json({
      success: true,
      pendingApplications: appsPending.count || 0,
      approvedMembers: membersAppr.count || 0,
      projectsBuilt: statsObj['projects_built'] || 0,
      liveSubscribers: cache.count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get Pending Applications
app.get('/api/admin/applications', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pending_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Get Members
app.get('/api/admin/members', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('community_members')
      .select('*')
      .eq('approved', true)
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Approve Member
app.post('/api/admin/approve-member', adminLimiter, requireAdmin, async (req, res) => {
  const { applicationId } = req.body;
  if (!applicationId) return res.status(400).json({ success: false, message: 'Missing applicationId' });

  try {
    // Note: Our postgres trigger 'move_approved_application' handles inserting into community_members
    // and 'assign_ds_id' assigns the DS ID. So we just need to update the application status.
    const { data, error } = await supabaseAdmin
      .from('pending_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    await logAdminActivity('Member Approved', applicationId, data.full_name);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Reject Member
app.post('/api/admin/reject-member', adminLimiter, requireAdmin, async (req, res) => {
  const { applicationId } = req.body;
  if (!applicationId) return res.status(400).json({ success: false, message: 'Missing applicationId' });

  try {
    const { data, error } = await supabaseAdmin
      .from('pending_applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    await logAdminActivity('Member Rejected', applicationId, data.full_name);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Update Projects Built
app.post('/api/admin/update-projects', adminLimiter, requireAdmin, async (req, res) => {
  const { count } = req.body;
  if (count === undefined) return res.status(400).json({ success: false, message: 'Missing count' });

  try {
    const { data, error } = await supabaseAdmin
      .from('community_stats')
      .upsert({ key: 'projects_built', value: parseInt(count, 10) })
      .select();

    if (error) throw error;

    await logAdminActivity('Project Count Updated', 'stats_projects_built', `${count}`);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Delete Member (Bonus)
app.post('/api/admin/delete-member', adminLimiter, requireAdmin, async (req, res) => {
  const { memberId, memberName } = req.body;
  if (!memberId) return res.status(400).json({ success: false, message: 'Missing memberId' });

  try {
    const { error } = await supabaseAdmin
      .from('community_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;

    await logAdminActivity('Member Deleted', memberId, memberName || 'Unknown');

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 9. Get Activity Logs
app.get('/api/admin/activity-logs', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------------------------------------------------------
// INIT
// ---------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
