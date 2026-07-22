const Message = require('../models/Message');

// GET /messages/:productId/:sellerId
// Returns conversation between the logged-in user (buyer) and the seller for a product
exports.getMessages = async (req, res) => {
  try {
    const { productId, sellerId } = req.params;
    const buyerId = req.user.id;

    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: buyerId,   receiver: sellerId },
        { sender: sellerId,  receiver: buyerId  },
      ],
    })
      .sort('createdAt')
      .populate('sender', 'name')
      .populate('receiver', 'name');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /messages
// Creates a message via REST (used as fallback; primary path is via Socket.io)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, productId, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Message text is required' });

    const message = await Message.create({
      sender:   req.user.id,
      receiver: receiverId,
      product:  productId,
      text:     text.trim(),
    });
    const populated = await message.populate('sender', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
