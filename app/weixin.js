import {Router} from 'express';
import config from '../config.js';
import moment from "moment";
import request from 'request-promise';
import crypto from 'crypto';
import {parseString} from 'xml2js';
import {Builder} from 'xml2js';

let router = Router();
let ticket = false;
let ticketExpiresAt = false;
let accessToken = false;
let tokenExpiresAt = false;

router.get('/test',(req,res) => {
	unSubscribe('ogaTPw1_A0vp9YoHwxwCXiXX1Gow');
	res.send('ok');
});

// 微信入口
router.post('/event',(req,res) => {
	let xmlData = '';
	req.on('data',data => {
		xmlData += data;
	});
	req.on('end',() => {
		processData(xmlData).then(result => {
			res.send(result);
		})
	});
});

router.get('/accessToken',(req,res) => {
	res.send(accessToken);
})

async function processData(xmlData) {
	let data = await new Promise((resolve,reject) => {
		parseString(xmlData,(err, result) => {
			if(err) resolve(false);
			if(result) resolve(result.xml);
		});
	});
	if(!data) return '';
	if(data.MsgType[0] == 'event')return await processEvent(data);
	if(data.MsgType[0] == 'text')return await processText(data);
	return '';
}

async function processEvent(data) {
	let result = '';
	if(data.Event[0] == 'subscribe') await subscribe(data.FromUserName[0]);
	if(data.Event[0] == 'unsubscribe') await unSubscribe(data.FromUserName[0]);
	return '';
}

async function processText(data) {
	let text = false;
	if(data.Content[0].indexOf('喵球') != -1) {
		text = '安卓下载地址（右上角选择浏览器打开）http://file.u77.com/apk/miaoqiu.apk';
	}else if(data.Content[0].indexOf('萝卜') != -1) {
		text = '安卓下载地址（右上角选择浏览器打开）http://file.u77.com/apk/done.apk';
	}else if(data.Content[0].indexOf('回忆') != -1) {
		text = '安卓下载地址（右上角选择浏览器打开）http://file.u77.com/apk/zhlsddgs2hhb.apk';
	}else if(data.Content[0].indexOf('贪吃蛇') != -1) {
		text = '安卓下载地址（右上角选择浏览器打开）http://www.wandoujia.com/apps/air.com.hypah.io.slither';
	}
	if(text) return createTextMsg(data.FromUserName[0],text);
	return '';	
}

function createTextMsg(openid,text) {
	let xml = `<xml><ToUserName><![CDATA[${openid}]]></ToUserName><FromUserName><![CDATA[${config.weixin.msgFrom}]]></FromUserName><CreateTime>${moment().unix()}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${text}]]></Content></xml>`;
	return xml;
}

// 验证
router.get('/event',(req,res) => {
	console.log('wechat validate start');
	console.dir(req.query);
	let dict = {
		token: config.weixin.Token, 
		timestamp:req.query.timestamp, 
		nonce:req.query.nonce
	};
	let _str = '';
	for (let key of Object.keys(dict).sort()) {
		_str += dict[key];
	}
	let _sign = crypto.createHash('sha1').update(_str, 'utf-8').digest('hex');
	if(_sign == req.query.signature){
		res.send(req.query.echostr);
		console.log('wechat validate successed.');
	}else {
		res.send('fail');
		console.log('wechat validate failed.');
	}
});

// 创建菜单
router.get('/createMenu',(req,res) => {
	let menu =  `{
    "button": [
	        {
	            "name": "玩游戏",
	            "sub_button": [
	                {
	                    "type": "view",
	                    "name": "艾德尔冒险",
	                    "url": "http://www.u77.com/gamegate/egret_login/90064"
	                }
	            ]
	        },
	        {
	            "name": "精品推荐",
	            "sub_button": [
	                {
	                    "type": "view",
	                    "name": "游戏杂谈",
	                    "url": "http://mp.weixin.qq.com/mp/homepage?__biz=MzI4NTE2NTE4NQ==&hid=2&sn=9a3ec53f5ab6df60fc02d6d61201e61a#wechat_redirect"
	                },
	                {
	                    "type": "view",
	                    "name": "晚报回顾",
	                    "url": "http://mp.weixin.qq.com/mp/homepage?__biz=MzI4NTE2NTE4NQ==&hid=3&sn=e3d4844c3c80028065a97cac5328457c#wechat_redirect"
	                }
	            ]
	        }
	    ]
	}`;
	checkStatus().then(status => {
		let url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`;
		let options = {
			method: 'POST',
		    uri: url,
		    form: menu
		}
		request(options).then(result => {
			console.log(result);
			res.send(result);
		})

	});
})

router.get('/ticket-api',(req,res) => {
	checkStatus().then(status => {
		if(status) {
			res.send({
				msg:'ok',
				ticket
			});
		}else {
			res.send({
				msg:'获取ticket失败,请刷新重试.',
				err:'ticket check failed'
			});
		}
	});
});

router.get('/subscribe/:unionId',(req,res) => {
	let unionId = req.params.unionId;
	console.log(unionId);
	fetchDetailByUnionId(unionId).then(user => {
		if(user) {
			res.send("true");
		}else {
			res.send('false');
		}
	})
})

router.get('/asyncUsersInfo',(req,res) => {
	try {
		checkStatus()
		.then(fetchAllUsers)
		.then(checkUsers);
	}catch (e) {
		console.log(e);
	}
	
	res.send('ok');
});

async function checkUsers(users) {
	users.map(async openId => {
		let query = new global.AV.Query('WechatUser');
		query.equalTo('openid',openId);
		let user;
		try {
			user = await query.first();
		}catch(e) {
			console.log(e);
		}
		if(!user)return await createUser(openId);
		return;
	});

	return true;
}

async function createUser(openId,unionId) {
	let detailInfo = await fetchDetail(openId);
	let user = new global.WechatUser(detailInfo);
	let result;
	try {
		result = await user.save();
	}catch(e) {
		console.log(e);
	}
	return result;
}

async function fetchDetail(openId) {
	await checkStatus();
	let url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openId}&lang=zh_CN`;
	let result = {};
	try{
		result = await request(url);
		result = JSON.parse(result);
	}catch(e) {
		console.log(e);
	}

	return result;
}

async function fetchDetailByUnionId(unionId) {
	let query = new global.AV.Query('WechatUser');
	query.equalTo('unionid',unionId);
	let user = false;
	try {
		user = await query.first();
	}catch (e) {
		console.log(e);
	}
	return user;
}

async function fetchAllUsers() {
	let users = await fetchUsers();
	return users;
}

async function fetchUsers(openId = 0,users = []) {
	await checkStatus();
	let url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}`;
	if(openId != 0) {
		url += ('&next_openId='+openId);
	}
	let result = await request(url);
	result = JSON.parse(result);
	if(result.count >= 10000) {
		users = await fetchUsers(result.next_openid,result.data.openid);
		return result.data.openid.concat(users);
	}
	return result.data.openid;
}

async function subscribe(openId) {
	await checkStatus();
	return await checkUsers([openId]);
}

async function unSubscribe(openId) {
	await checkStatus();
	return await deleteUser(openId);
}

async function deleteUser(openId) {
	let query = new global.AV.Query('WechatUser');
	query.equalTo('openid',openId);
	let user;
	let result = false;
	try {
		user = await query.first();
		if(user) result = await user.destroy();
	}catch(e) {
		console.log(e);
	}
	return result;
}

async function checkStatus() {
	let accessTokenStatus = false;
	let ticketStatus = false;

	if(!accessToken) {
		accessTokenStatus = await refreshToken();
	}
	if(!ticket){
		ticketStatus = await refreshTicket();
	}

	if(moment().unix() >= tokenExpiresAt) {
		accessTokenStatus = await refreshToken();
	}

	if(moment().unix() >= ticketExpiresAt) {
		ticketStatus = await refreshTicket();
	}

	if(accessToken && moment().unix() < tokenExpiresAt) {
		accessTokenStatus = true;
	}

	if(ticket && moment().unix() < ticketExpiresAt) {
		ticketStatus = true;
	}

	return accessTokenStatus && ticketStatus;
}

async function refreshToken() {
	let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.weixin.AppID}&secret=${config.weixin.AppSecret}`;
	let result = await request(url);
	try {
		result = JSON.parse(result);
	}catch(e) {
		console.log(e);
		return false;
	}

	if(result.access_token && result.expires_in){
		accessToken = result.access_token;
		tokenExpiresAt = moment().unix() + result.expires_in;
		return true;
	}
	return false;
}

async function refreshTicket() {
	if(!accessToken)return false;
	let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
	let result = await request(url);
	try {
		result = JSON.parse(result);
	}catch(e) {
		console.log(e);
		return false;
	}

	if(result.errcode == 0 && result.errmsg == 'ok' && result.ticket && result.expires_in) {
		ticket = result.ticket;
		ticketExpiresAt = moment().unix() + result.expires_in;
		return true;
	}

	return false;
}



export default router;
