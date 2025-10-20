const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:profiles!organizer_id(id, full_name, profile_picture_url),
        registrations:event_registrations(count)
      `);

    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('event_date', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:profiles!organizer_id(id, full_name, profile_picture_url, email),
        registrations:event_registrations(id, user_id, status, profiles(full_name, profile_picture_url))
      `)
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer_id: req.user.id
    };

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
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
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', req.params.id)
      .maybeSingle();

    if (!event || event.organizer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('events')
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
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', req.params.id)
      .maybeSingle();

    if (!event || event.organizer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/register', authenticateUser, async (req, res) => {
  try {
    const registrationData = {
      event_id: req.params.id,
      user_id: req.user.id,
      status: 'registered'
    };

    const { data, error } = await supabase
      .from('event_registrations')
      .insert([registrationData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id/register', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true, message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
