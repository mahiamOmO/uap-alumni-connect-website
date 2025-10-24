const supabase = require('../config/supabase');

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.userRole = profile.role;
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!profile || profile.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    req.userRole = profile.role;
    next();
  } catch (error) {
    console.error('Super admin authorization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { requireAdmin, requireSuperAdmin };
