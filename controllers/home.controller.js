//[GET]
module.exports.index = (req, res) => {
  res.render("pages/home/index.pug", {
    titlePage: "Trang chủ",
  });
};
