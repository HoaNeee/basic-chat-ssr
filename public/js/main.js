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
