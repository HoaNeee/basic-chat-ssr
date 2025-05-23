const chatRoute = require("./chat.route");
const homeRoute = require("./home.route");
const authRoute = require("./auth.route");
const authMiddleware = require("../middleware/auth.middleware");

module.exports = (app) => {
  app.use("/auth", authRoute);

  app.use(authMiddleware.requireAuth);

  app.use("/", homeRoute);
  app.use("/chat", chatRoute);
};
