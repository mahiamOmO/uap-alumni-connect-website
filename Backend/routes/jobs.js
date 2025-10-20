const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const { status, job_type, is_remote } = req.query;
    let query = supabase
      .from('jobs')
      .select(`
        *,
        poster:profiles!posted_by(id, full_name, current_company, profile_picture_url)
      `);

    if (status) query = query.eq('status', status);
    if (job_type) query = query.eq('job_type', job_type);
    if (is_remote !== undefined) query = query.eq('is_remote', is_remote === 'true');

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        poster:profiles!posted_by(id, full_name, current_company, profile_picture_url, email)
      `)
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      posted_by: req.user.id
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { data: job } = await supabase
      .from('jobs')
      .select('posted_by')
      .eq('id', req.params.id)
      .maybeSingle();

    if (!job || job.posted_by !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { data: job } = await supabase
      .from('jobs')
      .select('posted_by')
      .eq('id', req.params.id)
      .maybeSingle();

    if (!job || job.posted_by !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
