// const socket = io();

//request friend
const btnsRequest = document.querySelectorAll(".box-user [btn-request-friend]");
if (btnsRequest && btnsRequest.length > 0) {
  for (let btn of btnsRequest) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const boxUser = btn.closest(".box-user");
      boxUser.classList.add("add");
      socket.emit("CLIENT_REQUEST_FRIEND", id);
    });
  }
}

//cancel request
const btnsCancelRequest = document.querySelectorAll(
  ".box-user [btn-cancel-request]"
);
if (btnsCancelRequest && btnsCancelRequest.length > 0) {
  for (const btn of btnsCancelRequest) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const boxUser = btn.closest(".box-user");
      boxUser.classList.remove("add");
      boxUser.classList.add("cancel");
      socket.emit("CLIENT_CANCEL_REQUEST", id);
    });
  }
}

//refuse
const btnsRefuse = document.querySelectorAll(".box-user [btn-refuse-friend]");

if (btnsRefuse && btnsRefuse.length > 0) {
  for (const btn of btnsRefuse) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const boxUser = btn.closest(".box-user");
      boxUser.classList.add("refuse");
      socket.emit("CLIENT_REFUSE_FRIEND", id);
    });
  }
}

//accept
const btnsAccept = document.querySelectorAll(".box-user [btn-accept-friend]");

if (btnsAccept && btnsAccept.length > 0) {
  for (const btn of btnsAccept) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const boxUser = btn.closest(".box-user");
      boxUser.classList.add("accept");
      socket.emit("CLIENT_ACCEPT_FRIEND", id);
    });
  }
}

const drawSocketHelper = (data, add, remove) => {
  const userId = data.userId;
  const myUserId = data.myId;

  const divElement = document.querySelector("div[data-my-id]");
  const myId = divElement.getAttribute("data-my-id");
  if (userId === myId) {
    const boxUser = document.querySelector(`div[data-id-user="${myUserId}"]`);
    if (boxUser) {
      if (remove) {
        boxUser.classList.remove(remove);
      }
      if (add) {
        boxUser.classList.add(add);
      }
    }
  }
};

//SERVER_RETURN_REQUEST
socket.on("SERVER_RETURN_REQUEST", (data) => {
  drawSocketHelper(data, "receive", "");

  const userId = data.userId;
  const divElement = document.querySelector("div[data-my-id]");
  const myId = divElement.getAttribute("data-my-id");

  if (userId === myId) {
    const badgeLengthAccept = document.querySelector("[data-accept-length]");
    if (badgeLengthAccept) {
      badgeLengthAccept.innerHTML = data.lengthAccept;
    }
  }
});

//SERVER_RETURN_CANCEL
socket.on("SERVER_RETURN_CANCEL", (data) => {
  drawSocketHelper(data, "cancel", "receive");
  const userId = data.userId;

  const divElement = document.querySelector("div[data-my-id]");
  const myId = divElement.getAttribute("data-my-id");

  if (userId === myId) {
    const badgeLengthAccept = document.querySelector("[data-accept-length]");
    if (badgeLengthAccept) {
      badgeLengthAccept.innerHTML = data.lengthAccept;
    }
  }
});

//SERVER_RETURN_REFUSE
socket.on("SERVER_RETURN_REFUSE", (data) => {
  drawSocketHelper(data, "refuse", "add");
  const userId = data.userId;

  const divElement = document.querySelector("div[data-my-id]");
  const myId = divElement.getAttribute("data-my-id");

  if (userId === myId) {
    const badgeLengthRequest = document.querySelector("[data-request-length]");
    if (badgeLengthRequest) {
      badgeLengthRequest.innerHTML = data.lengthRequest;
    }
  }
});

//SERVER_RETURN_ACCEPT
socket.on("SERVER_RETURN_ACCEPT", (data) => {
  drawSocketHelper(data, "accept", "add");
  const userId = data.userId;

  const divElement = document.querySelector("div[data-my-id]");
  const myId = divElement.getAttribute("data-my-id");

  if (userId === myId) {
    const badgeLengthRequest = document.querySelector("[data-request-length]");
    if (badgeLengthRequest) {
      badgeLengthRequest.innerHTML = data.lengthRequest;
    }
  }
});

//SERVER_RETURN_LIST_REQUEST_USER_A
socket.on("SERVER_RETURN_LIST_REQUEST_USER_A", (data) => {
  const badgeLengthRequest = document.querySelector("[data-request-length]");
  badgeLengthRequest.innerHTML = data;
});

//SERVER_RETURN_LIST_ACCEPT_USER_A
socket.on("SERVER_RETURN_LIST_ACCEPT_USER_A", (data) => {
  const badgeLengthAccept = document.querySelector("[data-accept-length]");
  if (badgeLengthAccept) {
    badgeLengthAccept.innerHTML = data;
  }
});

//SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (data) => {
  const userId = data;

  const boxUser = document.querySelector(`div [data-id-user="${userId}"]`);
  if (boxUser) {
    const divStatus = boxUser.querySelector("[data-statusOnline]");
    if (divStatus) {
      divStatus.setAttribute("data-statusOnline", "online");
    }
  }
});
