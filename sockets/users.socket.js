const User = require("../models/user.model");
const RoomChat = require("../models/room-chat.model");

module.exports = async (res) => {
  const user = res.locals.user;

  _io.once("connection", (socket) => {
    //client send request
    socket.on("CLIENT_REQUEST_FRIEND", async (data) => {
      // A send request to B
      const myId = String(user._id); // A
      const userId = data; // B

      // save to database
      const userIdOfBInRequestA = await User.findOne({
        _id: myId,
        requestFriend: userId,
      });

      if (!userIdOfBInRequestA) {
        await User.updateOne(
          { _id: myId },
          { $push: { requestFriend: userId } }
        );
      }

      const userIdOfAInAcceptB = await User.findOne({
        _id: userId,
        acceptFriend: myId,
      });
      if (!userIdOfAInAcceptB) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriend: myId } }
        );
      }

      if (!userIdOfAInAcceptB || !userIdOfBInRequestA) {
        const userA = await User.findOne({ _id: myId }).select("-password");
        const userB = await User.findOne({ _id: userId }).select("-password");
        socket.emit(
          "SERVER_RETURN_LIST_REQUEST_USER_A",
          userA.requestFriend.length
        );
        socket.broadcast.emit("SERVER_RETURN_REQUEST", {
          myId: myId,
          userId: userId,
          lengthAccept: userB.acceptFriend.length,
        });
      }
      // console.log("request");
    });

    //client cancel request;
    socket.on("CLIENT_CANCEL_REQUEST", async (data) => {
      const myId = String(user._id); // A
      const userId = data; // B

      //splice or pull in mongodb
      const userIdOfAInAcceptB = await User.findOne({
        _id: userId,
        acceptFriend: myId,
      });
      if (userIdOfAInAcceptB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriend: myId },
          }
        );
      }

      const userIdOfBInRequestA = await User.findOne({
        _id: myId,
        requestFriend: userId,
      });
      if (userIdOfBInRequestA) {
        await User.updateOne(
          { _id: myId },
          { $pull: { requestFriend: userId } }
        );
      }

      if (userIdOfAInAcceptB || userIdOfBInRequestA) {
        const userA = await User.findOne({ _id: myId }).select("-password");
        const userB = await User.findOne({ _id: userId }).select("-password");
        socket.emit(
          "SERVER_RETURN_LIST_REQUEST_USER_A",
          userA.requestFriend.length
        );
        socket.broadcast.emit("SERVER_RETURN_CANCEL", {
          myId: myId,
          userId: userId,
          lengthAccept: userB.acceptFriend.length,
        });
      }
      // console.log("cancel");
    });

    //CLIENT_REFUSE_FRIEND
    socket.on("CLIENT_REFUSE_FRIEND", async (data) => {
      const userId = data; // A
      const myId = String(user._id); // B

      const userIdOfBInRequestA = await User.findOne({
        _id: userId,
        requestFriend: myId,
      });

      if (userIdOfBInRequestA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriend: myId },
          }
        );
      }

      const userIdOfAInAcceptB = await User.findOne({
        _id: myId,
        acceptFriend: userId,
      });
      if (userIdOfAInAcceptB) {
        await User.updateOne(
          {
            _id: myId,
          },
          {
            $pull: { acceptFriend: userId },
          }
        );
      }

      if (userIdOfAInAcceptB || userIdOfBInRequestA) {
        const userA = await User.findOne({ _id: myId }).select("-password");
        const userB = await User.findOne({ _id: userId }).select("-password");
        socket.emit(
          "SERVER_RETURN_LIST_ACCEPT_USER_A",
          userA.acceptFriend.length
        );
        socket.broadcast.emit("SERVER_RETURN_REFUSE", {
          myId: myId,
          userId: userId,
          lengthRequest: userB.requestFriend.length,
        });
      }

      // console.log("refuse");
    });

    //CLIENT_ACCEPT_FRIEND
    socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
      const myId = String(user._id); // B;
      const userId = data; // A;

      //both pull and push;
      const userIdOfBInRequestA = await User.findOne({
        _id: userId,
        requestFriend: myId,
      });

      const userIdOfAInAcceptB = await User.findOne({
        _id: myId,
        acceptFriend: userId,
      });

      let roomChat;

      if (userIdOfAInAcceptB || userIdOfBInRequestA) {
        const objectRoom = {
          typeRoom: "friend",
          status: "",
          users: [
            {
              user_id: myId,
              role: "superAdmin",
            },
            {
              user_id: userId,
              role: "superAdmin",
            },
          ],
        };
        const oldRoom = await RoomChat.findOne({
          typeRoom: "friend",
          deleted: false,
          $and: [{ "users.user_id": myId }, { "users.user_id": userId }],
        });
        if (oldRoom) {
          roomChat = oldRoom;
        } else {
          roomChat = new RoomChat(objectRoom);
          await roomChat.save();
        }
      }

      if (userIdOfBInRequestA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              listFriend: {
                user_id: myId,
                room_id: roomChat ? roomChat._id : "",
              },
            },
            $pull: { requestFriend: myId },
          }
        );
      }

      if (userIdOfAInAcceptB) {
        await User.updateOne(
          { _id: myId },
          {
            $push: {
              listFriend: {
                user_id: userId,
                room_id: roomChat ? roomChat._id : "",
              },
            },
            $pull: { acceptFriend: userId },
          }
        );
      }

      if (userIdOfAInAcceptB || userIdOfBInRequestA) {
        const userA = await User.findOne({ _id: myId }).select("-password");
        const userB = await User.findOne({ _id: userId }).select("-password");
        socket.emit(
          "SERVER_RETURN_LIST_ACCEPT_USER_A",
          userA.acceptFriend.length
        );
        socket.broadcast.emit("SERVER_RETURN_ACCEPT", {
          myId: myId,
          userId: userId,
          lengthRequest: userB.requestFriend.length,
        });
      }
      // console.log("accept");
    });

    //CLIENT_DELETE_FRIEND
    socket.on("CLIENT_DELETE_FRIEND", async (data) => {
      const user = res.locals.user;
      const myId = String(user._id); // A
      const userId = data; // B

      const userIdOfAInFriendB = await User.findOne({
        _id: userId,
        "listFriend.user_id": myId,
      });

      const userIdOfBInFriendA = await User.findOne({
        _id: myId,
        "listFriend.user_id": userId,
      });

      if (userIdOfAInFriendB) {
        const index = userIdOfAInFriendB.listFriend.findIndex(
          (item) => item.user_id === myId
        );
        if (index !== -1) {
          userIdOfAInFriendB.listFriend.splice(index, 1);
          await userIdOfAInFriendB.save();
        }
      }

      if (userIdOfBInFriendA) {
        const index = userIdOfBInFriendA.listFriend.findIndex(
          (item) => item.user_id === userId
        );
        if (index !== -1) {
          userIdOfBInFriendA.listFriend.splice(index, 1);
          await userIdOfBInFriendA.save();
        }
      }

      if (userIdOfAInFriendB || userIdOfBInFriendA) {
        socket.broadcast.emit("SERVER_RETURN_DELETE_FRIEND", {
          userId: myId,
        });
      }
    });
  });
};
