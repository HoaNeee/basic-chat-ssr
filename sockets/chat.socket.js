const Chat = require("../models/chat.model");
const uploadCloud = require("../helpers/uploadCloud");

module.exports.private = (req, res) => {
  const user = res.locals.user;

  const roomId = req.params.roomId;

  //dung once thay cho on khi chi muon ket noi 1 lan duy nhat
  _io.once("connection", (socket) => {
    // console.log("a user connected " + socket.id);
    socket.join(roomId);
    //client send data
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
        room_id: roomId,
      });
      await chat.save();

      _io.to(roomId).emit("SERVER_RETURN_DATA", {
        message: data.message,
        userId: String(user._id),
        fullname: user.fullname,
        images: imagesUrl,
      });
    });

    //client_typing
    socket.on("CLIENT_TYPING", (e) => {
      socket.broadcast.to(roomId).emit("SERVER_RETURN_TYPING", {
        data: e,
        userId: String(user._id),
        fullname: user.fullname,
      });
    });
  });
};

module.exports.community = (req, res) => {
  const user = res.locals.user;

  const roomId = "community";

  //dung once thay cho on khi chi muon ket noi 1 lan duy nhat
  _io.once("connection", (socket) => {
    // console.log("a user connected " + socket.id);
    socket.join(roomId);
    //client send data
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
        room_id: roomId,
      });
      await chat.save();

      _io.to(roomId).emit("SERVER_RETURN_DATA", {
        message: data.message,
        userId: String(user._id),
        fullname: user.fullname,
        images: imagesUrl,
      });
    });

    //client_typing
    socket.on("CLIENT_TYPING", (e) => {
      socket.broadcast.to(roomId).emit("SERVER_RETURN_TYPING", {
        data: e,
        userId: String(user._id),
        fullname: user.fullname,
      });
    });
  });
};
