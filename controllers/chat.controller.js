const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const uploadCloud = require("../helpers/uploadCloud");

//[GET] /chat
module.exports.index = async (req, res) => {
  const user = res.locals.user;

  //dung once thay cho on khi chi muon ket noi 1 lan duy nhat
  _io.once("connection", (socket) => {
    // console.log("a user connected " + socket.id);

    socket.on("CLIENT_SEND_DATA", async (data) => {
      const images = data.images || [];
      const imagesUrl = [];
      if (images.length > 0) {
        for (const item of images) {
          const result = await uploadCloud.upload(item);
          imagesUrl.push(result.url);
        }
      }

      const chat = new Chat({
        user_id: user._id,
        content: data.message,
        images: imagesUrl,
      });
      await chat.save();

      _io.emit("SERVER_RETURN_DATA", {
        message: data.message,
        userId: String(user._id),
        fullname: user.fullname,
        images: imagesUrl,
      });
    });

    //client_typing
    socket.on("CLIENT_TYPING", (e) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        data: e,
        userId: String(user._id),
        fullname: user.fullname,
      });
    });
  });

  const chats = await Chat.find({ deleted: false });

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
