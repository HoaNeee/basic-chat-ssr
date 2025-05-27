const User = require("../models/user.model");
const usersSocket = require("../sockets/users.socket");

//[GET] /users/notFriend
module.exports.notFriend = async (req, res) => {
  try {
    const user = res.locals.user;

    const myUser = await User.findOne({ _id: user._id });

    const userIdInListFriend = myUser.listFriend.map((item) =>
      String(item.user_id)
    );

    const users = await User.find({
      $and: [
        { _id: { $nin: myUser.acceptFriend } },
        { _id: { $nin: myUser.requestFriend } },
        { _id: { $nin: userIdInListFriend } },
        { _id: { $ne: user._id } },
      ],

      deleted: false,
    }).select("_id fullname avatar");

    usersSocket(res);

    // const newUsers = users.filter((user) => {
    //   const idOrther = String(user._id);
    //   const accepts = myUser.acceptFriend;
    //   const requests = myUser.requestFriend;
    //   //or find, findIndex, for
    //   if (accepts.includes(idOrther) || requests.includes(idOrther)) {
    //     return false;
    //   }
    //   return true;
    // });

    res.render("pages/users/notFriend.pug", {
      titlePage: "Người dùng",
      users: users,
    });
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect("/");
  }
};

//[GET] /users/requests
module.exports.requests = async (req, res) => {
  try {
    const user = res.locals.user;

    const myUser = await User.findOne({ _id: user._id });

    const users = await User.find({
      _id: { $in: myUser.requestFriend },
    }).select("_id fullname avatar");

    usersSocket(res);

    res.render("pages/users/request.pug", {
      titlePage: "Lời mời đã gửi",
      users: users,
    });
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect("/");
  }
};

//[GET] /users/accepts
module.exports.accepts = async (req, res) => {
  try {
    const user = res.locals.user;
    const myUser = await User.findOne({ _id: user._id });
    const users = await User.find({ _id: { $in: myUser.acceptFriend } });
    usersSocket(res);
    res.render("pages/users/accept.pug", {
      titlePage: "Lời mời kết bạn",
      users: users,
    });
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect("/");
  }
};

//[GET] /users/friends
module.exports.friends = async (req, res) => {
  try {
    const user = res.locals.user;
    const myUser = await User.findOne({ _id: user._id });

    const listFriend = myUser.listFriend;

    const usersId = listFriend.map((item) => item.user_id);

    const users = await User.find({ _id: { $in: usersId } }).select(
      "-password"
    );

    for (let item of users) {
      const myUserIdInListFriendOfB = item.listFriend.find(
        (it) => it.user_id === String(myUser._id)
      );
      item.room_chat_id = myUserIdInListFriendOfB.room_id;
    }
    usersSocket(res);
    res.render("pages/users/friends.pug", {
      titlePage: "Bạn bè",
      users: users,
    });
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect("/");
  }
};
