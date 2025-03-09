import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;

    // Make sure req.user exists (added by protectRoute middleware)
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "You must be logged in to send messages" });
    }

    const senderId = req.user._id;

    // Log important values for debugging
    console.log("Sender ID:", senderId);
    console.log("Recipient ID:", recipientId);
    console.log("Message:", message);

    if (!recipientId || !message) {
      return res
        .status(400)
        .json({ error: "Recipient ID and message content are required" });
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      // Find messages between the two users
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
