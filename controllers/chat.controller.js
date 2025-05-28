const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const RoomChat = require("../models/room-chat.model");
const chatSocket = require("../sockets/chat.socket");

//[GET] /chat
module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const roomsChatOfUser = await RoomChat.find({
    "users.user_id": user._id,
    deleted: false,
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
            room.avatarUser = userFind.avatar;
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
    deleted: false,
  });

  for (const room of roomsChatOfUser) {
    const listUsers = room.users;
    if (room.typeRoom === "friend") {
      for (let userFriend of listUsers) {
        if (String(user._id) !== String(userFriend.user_id)) {
          const userFind = await User.findOne({
            _id: userFriend.user_id,
            deleted: false,
          });
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
    if (roomChat.typeRoom === "friend") {
      for (let userChat of listUser) {
        if (String(userChat.user_id) !== String(user._id)) {
          const user = await User.findOne({ _id: userChat.user_id });
          if (user) {
            infoRoom.title = user.fullname;
            infoRoom.statusUser = user.statusOnline;
          }
        }
      }
    } else if (roomChat.typeRoom === "group") {
      for (const item of roomChat.users) {
        const userFind = await User.findOne({ _id: item.user_id }).select(
          "fullname avatar statusOnline"
        );
        if (userFind) {
          item.fullname = userFind.fullname;
          item.avatar = userFind.avatar;
          item.statusOnline = userFind.statusOnline;
        }
      }
      infoRoom = roomChat;
    }
  }

  res.render("pages/chat/room-chat.pug", {
    titlePage: "Chat",
    chats: chats,
    roomsChat: roomsChatOfUser,
    infoRoom: infoRoom,
  });
};

//[GET] /chat/create-room
module.exports.createRoom = async (req, res) => {
  const user = res.locals.user;
  for (const item of user.listFriend) {
    const userFriend = await User.findOne({
      _id: item.user_id,
      deleted: false,
    }).select("fullname avatar");
    if (userFriend) {
      item.fullname = userFriend.fullname;
      item.avatar = userFriend.avatar;
    }
  }
  res.render("pages/chat/create.pug", {
    titlePage: "Tạo phòng chat",
    listFriend: user.listFriend,
  });
};

//[POST] /chat/create-room
module.exports.createRoomPost = async (req, res) => {
  try {
    const title = req.body.title;
    const userIds = req.body.userIds;
    const myUser = res.locals.user;
    let users = [];
    users.push({
      user_id: String(myUser._id),
      role: "superAdmin",
    });
    if (typeof userIds === "string") {
      users.push({
        user_id: userIds,
        role: "user",
      });
    } else {
      for (const item of userIds) {
        users.push({
          user_id: item,
          role: "user",
        });
      }
    }

    const newRoom = new RoomChat({
      title: title,
      users: users,
      typeRoom: "group",
    });
    await newRoom.save();
    res.redirect(`/chat/room/${newRoom._id}`);
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect("/");
  }
};
