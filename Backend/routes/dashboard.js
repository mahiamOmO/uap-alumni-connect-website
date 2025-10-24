const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');
const { requireAdmin, requireSuperAdmin } = require('../middleware/admin');

router.get('/stats', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/user-growth', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_user_growth_stats');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/recent-activity', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const { data, error } = await supabase.rpc('get_recent_activity', { limit_count: limit });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, is_active, is_verified } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) query = query.eq('role', role);
    if (is_active !== undefined) query = query.eq('is_active', is_active === 'true');
    if (is_verified !== undefined) query = query.eq('is_verified', is_verified === 'true');

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/users/:id/role', authenticateUser, requireSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('user_activity').insert([{
      user_id: req.user.id,
      activity_type: 'role_updated',
      activity_details: {
        target_user_id: req.params.id,
        new_role: role
      }
    }]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/users/:id/status', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { is_active, is_verified } = req.body;
    const updates = {};

    if (is_active !== undefined) updates.is_active = is_active;
    if (is_verified !== undefined) updates.is_verified = is_verified;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('user_activity').insert([{
      user_id: req.user.id,
      activity_type: 'user_status_updated',
      activity_details: {
        target_user_id: req.params.id,
        updates
      }
    }]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/reports', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { status, report_type } = req.query;
    let query = supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reported_by(id, full_name, email),
        resolver:profiles!resolved_by(id, full_name)
      `)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (report_type) query = query.eq('report_type', report_type);

    const { data, error } = await query;

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/reports', authenticateUser, async (req, res) => {
  try {
    const reportData = {
      reported_by: req.user.id,
      report_type: req.body.report_type,
      target_type: req.body.target_type,
      target_id: req.body.target_id,
      reason: req.body.reason,
      description: req.body.description
    };

    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/reports/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };

    if (status === 'resolved') {
      updates.resolved_by = req.user.id;
      updates.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('user_activity').insert([{
      user_id: req.user.id,
      activity_type: 'report_resolved',
      activity_details: {
        report_id: req.params.id,
        status
      }
    }]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/events/analytics', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data: eventStats, error } = await supabase
      .from('events')
      .select(`
        status,
        event_type,
        registrations:event_registrations(count)
      `);

    if (error) throw error;

    const analytics = {
      by_status: {},
      by_type: {},
      total_registrations: 0
    };

    eventStats.forEach(event => {
      analytics.by_status[event.status] = (analytics.by_status[event.status] || 0) + 1;
      analytics.by_type[event.event_type] = (analytics.by_type[event.event_type] || 0) + 1;
      analytics.total_registrations += event.registrations[0]?.count || 0;
    });

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/jobs/analytics', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data: jobStats, error } = await supabase
      .from('jobs')
      .select('status, job_type, is_remote');

    if (error) throw error;

    const analytics = {
      by_status: {},
      by_type: {},
      remote_vs_onsite: { remote: 0, onsite: 0 }
    };

    jobStats.forEach(job => {
      analytics.by_status[job.status] = (analytics.by_status[job.status] || 0) + 1;
      analytics.by_type[job.job_type] = (analytics.by_type[job.job_type] || 0) + 1;
      if (job.is_remote) {
        analytics.remote_vs_onsite.remote++;
      } else {
        analytics.remote_vs_onsite.onsite++;
      }
    });

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/posts/analytics', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { data: postStats, error } = await supabase
      .from('posts')
      .select('post_type, likes_count, comments_count, created_at');

    if (error) throw error;

    const analytics = {
      by_type: {},
      total_likes: 0,
      total_comments: 0,
      avg_engagement: 0,
      posts_last_7_days: 0
    };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    postStats.forEach(post => {
      analytics.by_type[post.post_type] = (analytics.by_type[post.post_type] || 0) + 1;
      analytics.total_likes += post.likes_count || 0;
      analytics.total_comments += post.comments_count || 0;

      if (new Date(post.created_at) >= sevenDaysAgo) {
        analytics.posts_last_7_days++;
      }
    });

    analytics.avg_engagement = postStats.length > 0
      ? ((analytics.total_likes + analytics.total_comments) / postStats.length).toFixed(2)
      : 0;

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/activity', authenticateUser, async (req, res) => {
  try {
    const activityData = {
      user_id: req.user.id,
      activity_type: req.body.activity_type,
      activity_details: req.body.activity_details || {},
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    const { data, error } = await supabase
      .from('user_activity')
      .insert([activityData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
