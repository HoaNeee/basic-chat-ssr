const socket = io();

//alert for basic
const alertElement = document.querySelector(".alert-custom");
if (alertElement) {
  let time = alertElement.getAttribute("time");
  time = Number(time);
  setTimeout(() => {
    alertElement.classList.add("alert-hidden");
  }, time);
}

//FIX THEN
//SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (data) => {
  const userId = data;
  const boxUser = document.querySelector(`div [data-id-user="${userId}"]`);
  if (boxUser) {
    const divStatus = boxUser.querySelector("[data-statusOnline]");
    if (divStatus) {
      divStatus.setAttribute("data-statusOnline", "offline");
    }
  }
});

const pathName = window.location.pathname;
const navActive = document.querySelector(`a[href="${pathName}"]`);
if (navActive) {
  navActive.classList.add("active");
}
if (pathName === "/") {
  const navActive = document.querySelector("a[data-path-home]");
  navActive.classList.add("active");
}

const sider = document.querySelector(".sider");

// window.addEventListener("beforeunload", (e) => {
//   socket.emit("CLIENT_SEND_USER_OFFLINE", "offline");
// });

//SERVER_RETURN_REQUEST
socket.on("SERVER_RETURN_REQUEST", (data) => {
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
