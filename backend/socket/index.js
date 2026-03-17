const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a specific chat room
    socket.on('join_room', (chatId) => {
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    // Leave a specific chat room
    socket.on('leave_room', (chatId) => {
      socket.leave(chatId);
      console.log(`User left room: ${chatId}`);
    });

    // Handle sending a message in real-time
    socket.on('send_message', async (data) => {
      const { chatId, senderId, text } = data;

      try {
        const chat = await Chat.findById(chatId);
        
        if (chat) {
          const newMessage = {
            senderId,
            text,
            timestamp: Date.now(),
          };

          // Save message to DB
          chat.messages.push(newMessage);
          chat.lastMessage = { text, timestamp: newMessage.timestamp };
          await chat.save();

          // Broadcast the message to everyone in the room
          io.to(chatId).emit('receive_message', newMessage);
        }
      } catch (error) {
        console.error('Socket Message Error:', error);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('user_typing', data);
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.chatId).emit('user_stopped_typing', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
