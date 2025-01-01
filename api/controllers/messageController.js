const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const message = new Message({ senderId, receiverId, content });
    await message.save();

    res.status(200).json({ message: "Message sent successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};
exports.getMessages = async (req, res) => {
    try {
      const { senderId, receiverId } = req.query;
      if (!senderId || !receiverId) {
        return res.status(400).json({ message: "Missing required parameters." });
      }
  
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 }); // Sort messages by timestamp (oldest first)
  
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving messages", error: error.message });
    }
  };
  exports.markAsRead = async (req, res) => {
    try {
      const { messageId } = req.body;
      if (!messageId) {
        return res.status(400).json({ message: "Message ID is required." });
      }
  
      const message = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );
  
      res.status(200).json({ message: "Message marked as read", message });
    } catch (error) {
      res.status(500).json({ message: "Error marking message as read", error: error.message });
    }
  };
    