const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const { post_type } = req.query;
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, full_name, current_position, current_company, profile_picture_url)
      `);

    if (post_type) query = query.eq('post_type', post_type);

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
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, full_name, current_position, current_company, profile_picture_url),
        comments:post_comments(
          id,
          content,
          created_at,
          author:profiles!author_id(id, full_name, profile_picture_url)
        )
      `)
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author_id: req.user.id
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
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
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', req.params.id)
      .maybeSingle();

    if (!post || post.author_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('posts')
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
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', req.params.id)
      .maybeSingle();

    if (!post || post.author_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/like', authenticateUser, async (req, res) => {
  try {
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (existingLike) {
      return res.status(400).json({ success: false, error: 'Already liked' });
    }

    const { data, error } = await supabase
      .from('post_likes')
      .insert([{ post_id: req.params.id, user_id: req.user.id }])
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc('increment', {
      table_name: 'posts',
      column_name: 'likes_count',
      row_id: req.params.id
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id/like', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    await supabase
      .from('posts')
      .update({ likes_count: supabase.rpc('greatest', { a: 0, b: 'likes_count - 1' }) })
      .eq('id', req.params.id);

    res.json({ success: true, message: 'Like removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/comments', authenticateUser, async (req, res) => {
  try {
    const commentData = {
      post_id: req.params.id,
      author_id: req.user.id,
      content: req.body.content
    };

    const { data, error } = await supabase
      .from('post_comments')
      .insert([commentData])
      .select(`
        *,
        author:profiles!author_id(id, full_name, profile_picture_url)
      `)
      .single();

    if (error) throw error;

    await supabase
      .from('posts')
      .update({ comments_count: supabase.rpc('increment', { amount: 1 }) })
      .eq('id', req.params.id);

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/comments', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:profiles!author_id(id, full_name, profile_picture_url)
      `)
      .eq('post_id', req.params.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
