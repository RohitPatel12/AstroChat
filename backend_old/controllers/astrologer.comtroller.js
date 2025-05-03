// Get astrologer profile
export const getAstrologerProfile = async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id);
      if (user.role !== 'astrologer') {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  