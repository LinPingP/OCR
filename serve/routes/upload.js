const multer = require('koa-multer')

let storage = multer.diskStorage({
    //文件保存路径 这个路由是以项目文件夹 也就是和入口文件（如app.js同一个层级的）
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

let upload = multer({
    storage: storage,
});

module.exports = upload