app.get('/jobs', async (req, res) => {
    const jobs = await getAsync('github');
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    return res.send(jobs);
})
exports.resetPassword = async (req, res, next) => {
    const { password } = req.body;
    try {
      const user = req.user; // User is attached by validateToken middleware
      user.password = password;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      //next(err); // Forward error to errorHandler middleware
      res.status(500).json({ error: 'Server error' });
    }
  };