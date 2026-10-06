const router = require('../router');

// 获取扫码登录二维码
router.get('/netease/qr/generate', async (req, res) => {
  try {
    const qr = await req.api.qrKey();
    res.json({ success:true, data: qr });
  } catch(e) {
    res.status(500).json({ success:false, msg: String(e) });
  }
});

// 查询扫码状态
router.post('/netease/qr/check', async (req, res) => {
  const { qrKey } = req.body;
  try {
    const result = await req.api.qrCheck(qrKey);
    res.json({ success:true, data: result });
  } catch(e) {
    res.status(500).json({ success:false, msg: String(e) });
  }
});

// 获取用户歌单
router.get('/netease/user/playlist', async (req, res) => {
  try {
    const data = await req.api.userPlaylist({ limit:1000 });
    res.json({ success:true, data });
  } catch(e) {
    res.status(500).json({ success:false, msg:String(e) });
  }
});

// 获取歌单里面歌曲
router.get('/netease/playlist/track', async (req, res) => {
  const { id } = req.query;
  try {
    const data = await req.api.playlistDetail(id);
    res.json({ success:true, data });
  } catch(e) {
    res.status(500).json({ success:false, msg:String(e) });
  }
});

// 获取歌曲播放地址
router.get('/netease/song/url', async (req, res) => {
  const { id } = req.query;
  try {
    const data = await req.api.songUrl(id);
    res.json({ success:true, data });
  } catch(e) {
    res.status(500).json({ success:false, msg:String(e) });
  }
});

// 退出登录清除session
router.post('/netease/logout', (req,res)=>{
  req.session.destroy();
  res.json({success:true});
})

module.exports = router;

const session = require('express-session');

// session配置
app.use(session({
  secret: 'mochi‑netease‑secret‑2026',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

//跨域配置，只允许你的mochi网页访问后端
const allowOrigin = /^https:\/\/Apricity-caleb\.github\.io$/;
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if(origin && allowOrigin.test(origin)){
    res.setHeader('Access‑Control‑Allow‑Origin', origin);
  }
  res.setHeader('Access‑Control‑Allow‑Credentials','true');
  res.setHeader('Access‑Control‑Allow‑Methods','GET,POST,OPTIONS');
  res.setHeader('Access‑Control‑Allow‑Headers','Content‑Type');
  if(req.method === 'OPTIONS') return res.sendStatus(200);
  next();
})

//挂载我们刚刚写好的代理路由
require('./routes/mochiProxy');
