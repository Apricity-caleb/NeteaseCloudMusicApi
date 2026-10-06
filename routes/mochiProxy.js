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
