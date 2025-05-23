const User = require("../models/user.model");
const md5 = require("md5");

const generate = require("../helpers/generate");

//[GET] /auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.tokenUserChat;
  if (token) {
    const user = await User.findOne({ token: token, deleted: false });
    if (user) {
      res.redirect("/");
      return;
    } else {
      res.clearCookie("tokenUserChat");
    }
  }
  res.render("pages/auth/login.pug", {
    titlePage: "Đăng nhập",
  });
};

//[GET] /auth/register
module.exports.register = async (req, res) => {
  const token = req.cookies.tokenUserChat;
  if (token) {
    const user = await User.findOne({ token: token, deleted: false });
    if (user) {
      res.redirect("/");
      return;
    } else {
      res.clearCookie("tokenUserChat");
    }
  }
  res.render("pages/auth/register.pug", {
    titlePage: "Đăng ký",
  });
};

//[POST] /auth/login
module.exports.loginPost = async (req, res) => {
  try {
    const password = md5(req.body.password);
    const email = req.body.email;
    const user = await User.findOne({ email: email, deleted: false });
    if (!user) {
      req.flash("error", "Email không tồn tại");
      res.redirect(req.get("Referer"));
      return;
    }
    if (user.password !== password) {
      req.flash("error", "Mật khẩu không chính xác");
      res.redirect(req.get("Referer"));
      return;
    }

    const token = generate.string(20);
    await User.updateOne({ email: email }, { token: token });

    res.cookie("tokenUserChat", token);

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(req.get("Referer"));
  }
};

//[POST] /auth/register
module.exports.registerPost = async (req, res) => {
  try {
    const password = md5(req.body.password);
    const email = req.body.email;
    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      req.flash("error", "Email đã tồn tại trong hệ thống");
      res.redirect(req.get("Referer"));
      return;
    }
    const user = new User({
      ...req.body,
      password: password,
    });
    await user.save();
    req.flash("success", "Tạo tài khoản thành công");
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("error", "An error occurred" + error);
    res.redirect(req.get("Referer"));
  }
};

//[GET] /auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUserChat");
  res.redirect("/auth/login");
};
