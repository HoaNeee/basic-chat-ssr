const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const RoomChat = require("../models/room-chat.model");
const chatSocket = require("../sockets/chat.socket");

//[GET] /chat
module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const roomsChatOfUser = await RoomChat.find({
    "users.user_id": user._id,
  });

  for (const room of roomsChatOfUser) {
    if (room.typeRoom === "friend") {
      const listUsers = room.users;
      for (let userFriend of listUsers) {
        if (String(user._id) !== String(userFriend.user_id)) {
          const userFind = await User.findOne({
            _id: userFriend.user_id,
          }).select("-password");
          if (userFind) {
            room.fullnameUser = userFind.fullname;
            room.statusUser = userFind.statusOnline;
            room.avatar = userFind.avatar;
          }
        }
      }
    }
  }

  res.render("pages/chat/index.pug", {
    titlePage: "Chat",
    roomsChat: roomsChatOfUser,
  });
};

//[GET] /chat/room/:roomId
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

  const user = res.locals.user;
  const roomsChatOfUser = await RoomChat.find({
    "users.user_id": user._id,
  });

  for (const room of roomsChatOfUser) {
    if (room.typeRoom === "friend") {
      const listUsers = room.users;
      for (let userFriend of listUsers) {
        if (String(user._id) !== String(userFriend.user_id)) {
          const userFind = await User.findOne({ _id: userFriend.user_id });
          if (userFind) {
            room.fullnameUser = userFind.fullname;
            room.avatarUser = userFind.avatar;
            room.statusUser = userFind.statusOnline;
          }
        }
      }
    }
  }

  let infoRoom = {};

  if (roomId === "community") {
    infoRoom.title = "Phòng cộng đồng";
  } else {
    const roomChat = await RoomChat.findOne({ _id: roomId });
    const listUser = roomChat.users;
    for (let userChat of listUser) {
      if (String(userChat.user_id) !== String(user._id)) {
        const user = await User.findOne({ _id: userChat.user_id });
        if (user) {
          infoRoom.title = user.fullname;
          infoRoom.statusUser = user.statusOnline;
        }
      }
    }
  }

  res.render("pages/chat/room-chat.pug", {
    titlePage: "Chat",
    chats: chats,
    roomsChat: roomsChatOfUser,
    infoRoom: infoRoom,
  });
};
