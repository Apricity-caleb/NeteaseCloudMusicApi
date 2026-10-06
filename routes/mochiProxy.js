const express = require('express');
const router = express.Router();
const { createRequest } = require('../util/request');

// 开启session，存储网易云凭证，HttpOnly，绝不返回前端
router.post('/netease/qr/new', async (req, res) => {
  try {
    const qrRes = await createRequest('/login/qr/create', {
      timestamp: Date.now()
    });
    req.session.neteaseCookie = qrRes.cookie || [];
    res.json({
      data: {
        qrKey: qrRes.data?.unikey,
        qrImgUrl: `https://music.163.com/login?qr=${qrRes.data?.unikey}`
      }
    });
  } catch (e) {
    res.status(500).json({error:e.message});
  }
});

router.post('/netease/qr/check', async (req, res) => {
  const {qrKey} = req.body;
  try {
    const check = await createRequest('/login/qr/check', {
      unikey: qrKey,
      timestamp: Date.now()
    }, {cookie: req.session.neteaseCookie||[]});
    if(check.cookie && check.cookie.length>0){
      req.session.neteaseCookie = check.cookie;
    }
    res.json({data:{code:check.code}});
  } catch(e){
    res.status(500).json({error:e.message});
  }
});

router.post('/netease/session',async (req,res)=>{
  try{
    if(!req.session.neteaseCookie){
      return res.json({data:null});
    }
    const info = await createRequest('/user/account',{},{cookie:req.session.neteaseCookie});
    res.json({data:info});
  }catch(e){
    res.status(500).json({error:e.message});
  }
});

router.post('/netease/logout',async (req,res)=>{
  req.session.destroy();
  res.json({ok:true});
});

router.post('/netease/playlists',async (req,res)=>{
  try{
    if(!req.session.neteaseCookie) return res.json({data:[]});
    const pl = await createRequest('/user/playlist',{
      uid: req.session.uid||''
    },{cookie:req.session.neteaseCookie});
    res.json({data:pl.playlist||[]});
  }catch(e){
    res.status(500).json({error:e.message});
  }
});

router.post('/netease/playlist/tracks',async (req,res)=>{
  const {playlistId} = req.body;
  try{
    const list = await createRequest('/playlist/track/all',{
      id:playlistId,limit:1000
    },{cookie:req.session.neteaseCookie});
    res.json({data:list.songs||[]});
  }catch(e){
    res.status(500).json({error:e.message});
  }
});

router.post('/netease/song/url',async (req,res)=>{
  const {id} = req.body;
  try{
    const urlData = await createRequest('/song/url/v1',{
      id,level:"exhigh"
    },{cookie:req.session.neteaseCookie});
    res.json({data:urlData.data?.[0]||null});
  }catch(e){
    res.status(500).json({error:e.message});
  }
});

module.exports = router;
