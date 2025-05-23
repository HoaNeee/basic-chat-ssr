import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

const socket = io();

//images preview;
let arrImageGlobals = [];
let maxImage = 6;
const images = document.querySelector('input[name="images"]');
const set = new Set();
if (images) {
  images.addEventListener("change", (e) => {
    const files = e.target.files;

    let arrImagesUrl = [...arrImageGlobals];
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (!set.has(item.name) && arrImagesUrl.length < maxImage) {
        arrImagesUrl.push({
          urlTemp: URL.createObjectURL(item),
          file: item,
          name: item.name,
        });
        set.add(item.name);
      }
    }

    //draw
    const divContentUpload = document.querySelector(
      ".custom-file-container .inner-content-upload"
    );
    let htmls = ``;
    for (let i = 0; i < arrImagesUrl.length; i++) {
      const item = arrImagesUrl[i];
      htmls += `
        <div class="inner-item" data-index=${i} data-name="${item.name}">
      `;
      htmls += `<img src="${item.urlTemp}">`;
      htmls += `<button class="btn-delete-item" data-index=${i}>X</button>`;

      htmls += `</div>`;
    }
    if (arrImagesUrl.length > 0) {
      divContentUpload.classList.add("shown");
    } else {
      divContentUpload.classList.remove("shown");
    }
    divContentUpload.innerHTML = htmls;

    const btnsDelete = document.querySelectorAll(
      ".inner-content-upload .btn-delete-item"
    );
    arrImageGlobals = [...arrImagesUrl];
    for (const btn of btnsDelete) {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const itemIndex = divContentUpload.querySelector(
          `div[data-index="${index}"]`
        );
        const name = itemIndex.getAttribute("data-name");
        if (itemIndex) {
          set.delete(name);
          divContentUpload.removeChild(itemIndex);
          arrImageGlobals = arrImageGlobals.filter(
            (item) => item.name !== name
          );
        }
        if (arrImageGlobals.length <= 0) {
          images.value = "";
          divContentUpload.classList.remove("shown");
        }
      });
    }
  });
}

//CLIENT_SEND_DATA
const formSendMessage = document.querySelector(".chat .form-send-message");
if (formSendMessage) {
  const inputMessage = document.querySelector(".chat .input-message");
  formSendMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    const files = arrImageGlobals.map((item) => item.file);
    if (message || arrImageGlobals.length > 0) {
      socket.emit("CLIENT_SEND_DATA", {
        message: message,
        images: files,
      });
      const divContentUpload = document.querySelector(
        ".custom-file-container .inner-content-upload"
      );
      divContentUpload.classList.remove("shown");
      arrImageGlobals = [];
      set.clear();
      inputMessage.value = "";
    }
  });

  //emoji
  const emojiElement = document.querySelector("emoji-picker");
  if (emojiElement) {
    emojiElement.addEventListener("emoji-click", (e) => {
      const icon = e.detail.unicode;
      inputMessage.value += icon;
      inputMessage.setSelectionRange(
        inputMessage.value.length,
        inputMessage.value.length
      );
      inputMessage.focus();
      socket.emit("CLIENT_TYPING", "shown");
    });
  }
}

const bodyMessage = document.querySelector(".chat .inner-body");
bodyMessage.scrollTop = bodyMessage.scrollHeight;

const gallery = new Viewer(bodyMessage);

//SEVER_RETURN_DATA
socket.on("SERVER_RETURN_DATA", (object) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document
    .querySelector(".chat div[data-id]")
    .getAttribute("data-id");

  const listTyping = document.querySelector(".chat .inner-list-typing");

  if (body) {
    const div = document.createElement("div");

    if (myId === object.userId) {
      div.classList.add("inner-outgoing");
    } else {
      div.classList.add("inner-incoming");
    }

    let htmlName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId !== object.userId) {
      htmlName = `<div class="inner-name">${object.fullname}</div>`;
    }

    if (object.message) {
      htmlContent = `<div class="inner-content">${object.message}</div>`;
    }

    if (object.images && object.images.length > 0) {
      htmlImages += `<div class="inner-images">`;

      for (const item of object.images) {
        htmlImages += `<img src=${item} alt"image">`;
      }

      htmlImages += `</div>`;
    }

    div.innerHTML = `
        ${htmlName}
        ${htmlContent}
        ${htmlImages}
    `;
    body.insertBefore(div, listTyping);
    const gallery = new Viewer(div);
    body.scrollTop = body.scrollHeight;
  }
});

//emoji picker
const btnIcon = document.querySelector(".chat .btn-icon");

if (btnIcon) {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    Popper.createPopper(btnIcon, tooltip);
  }
  btnIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });
}

//typing
const inputMessage = document.querySelector(".chat .input-message");
if (inputMessage) {
  inputMessage.addEventListener("keyup", (e) => {
    const value = e.target.value;

    if (value) {
      socket.emit("CLIENT_TYPING", "shown");
    } else {
      socket.emit("CLIENT_TYPING", "hidden");
    }
  });
}

//SERVER_RETURN_TYPING
socket.on("SERVER_RETURN_TYPING", (object) => {
  //list
  //div(class="inner-list-typing")
  // div(class="box-typing" data-id="")
  //   div(class="inner-name") Nguyen van a
  //   div(class="inner-dots")
  //     span
  //     span
  //     span

  const body = document.querySelector(".chat .inner-body");
  const listTyping = document.querySelector(".chat .inner-list-typing");

  const boxTyping = document.querySelector(
    `.chat .box-typing[data-id="${object.userId}"]`
  );

  if (boxTyping) {
    if (object.data === "hidden") {
      listTyping.removeChild(boxTyping);
    }
  } else {
    if (object.data === "shown") {
      const divElement = document.createElement("div");
      divElement.classList.add("box-typing");
      divElement.setAttribute("data-id", object.userId);
      let html = `
      <div class="inner-name">${object.fullname}</div>
      <div class="inner-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
      divElement.innerHTML = html;
      listTyping.appendChild(divElement);
    }
  }

  body.scrollTop = body.scrollHeight;
});
