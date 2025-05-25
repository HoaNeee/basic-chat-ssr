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
