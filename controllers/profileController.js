import User from '../models/User.js';

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { name, bio, avatarUrl } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatarUrl },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
};