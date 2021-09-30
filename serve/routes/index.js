const router = require('koa-router')()
const upload = require('./upload')
const fs = require('fs')

const AipOcrClient = require("baidu-aip-sdk").ocr;
// 设置APPID/AK/SK
const APP_ID = "24927330";
const API_KEY = "nergzS3G3nwLML0vj0UVmHoG";
const SECRET_KEY = "D7jKX7cXZt1UIppTvf5xkmjPDDRfEYMy";
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.post('/upload', upload.single('file'), async (ctx, next) => {
  const fileName = ctx.req.file.filename;
  const image = fs.readFileSync(`images/${fileName}`).toString("base64");
  // 调用通用文字识别, 图片参数为本地图片
  // const { words_result } = await client.accurateBasic(image); // 通用文字识别，高精度版

  var options = {
    recognize_granularity:'big' // 不带定位单字符位置 small定位
  };
  const { words_result } = await client.accurate(image,options); // 通用文字识别，带位置，高精度版

  let text;
  
  if (words_result.length > 0) {
    let top = +words_result[0].location.top;
    words_result.forEach(item => {
      if(top !== +item.location.top){
        text += '<br>'
      }
      text += item.words
      top = +item.location.top;
    })
  }
  ctx.body = {
    textItem: {
        name: fileName,
        text: text,
    },
    code: 200,
    desc: 'success'
  }
  // 删除识别的图片
  fs.unlink(`images/${fileName}`, function(err){
      if(err){
          throw err;
      }
  })
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
