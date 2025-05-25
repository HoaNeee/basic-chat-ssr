const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUserChat) {
    res.redirect("/auth/login");
    return;
  } else {
    const token = req.cookies.tokenUserChat;
    const user = await User.findOne({ token: token, deleted: false }).select(
      "-password"
    );
    if (!user) {
      res.clearCookie("tokenUserChat");
      res.redirect("/auth/login");
      return;
    } else {
      if (user.statusOnline !== "online") {
        await User.updateOne({ token: token }, { statusOnline: "online" });
      }

      res.locals.user = user;
      next();
    }
  }
};
