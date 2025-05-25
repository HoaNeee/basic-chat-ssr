const RoomChat = require("../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomId = req.params.roomId;
  const user = res.locals.user;
  const userId = String(user._id);
  const roomChat = await RoomChat.findOne({ _id: roomId, deleted: false }); //status,...
  if (roomChat) {
    const existUser = roomChat.users.find((user) => user.user_id === userId);
    if (existUser) {
      next();
    } else {
      req.flash("error", "Bạn không có quyền");
      res.redirect("/");
    }
  }
};
