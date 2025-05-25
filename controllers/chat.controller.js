const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const chatSocket = require("../sockets/chat.socket");

//[GET] /chat
module.exports.index = async (req, res) => {
  const chats = await Chat.find({ room_id: "community", deleted: false });

  //socket
  chatSocket.community(req, res);

  for (const item of chats) {
    const user = await User.findOne({ _id: item.user_id }).select("fullname");
    if (user) {
      item.user = user;
    }
  }

  res.render("pages/chat/index.pug", {
    titlePage: "Chat",
    chats: chats,
  });
};

//[GET] /chat/:roomId
module.exports.chatPrivate = async (req, res) => {
  const roomId = req.params.roomId;

  const chats = await Chat.find({ room_id: roomId, deleted: false });

  //socket
  chatSocket.private(req, res);

  for (const item of chats) {
    const user = await User.findOne({ _id: item.user_id }).select("fullname");
    if (user) {
      item.user = user;
    }
  }

  res.render("pages/chat/index.pug", {
    titlePage: "Chat",
    chats: chats,
  });
};
