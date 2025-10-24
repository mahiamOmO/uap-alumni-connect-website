const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const profileData = {
      id: req.user.id,
      email: req.user.email,
      ...req.body
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
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
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('profiles')
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

router.get('/search/alumni', authenticateUser, async (req, res) => {
  try {
    const { year, department, company } = req.query;
    let query = supabase.from('profiles').select('*');

    if (year) query = query.eq('graduation_year', year);
    if (department) query = query.eq('department', department);
    if (company) query = query.ilike('current_company', `%${company}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
