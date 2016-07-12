import {Router} from 'express';
import config from '../config.js';
import moment from "moment";
import request from 'request-promise';
import crypto from 'crypto';
import {parseString} from 'xml2js';


let router = Router();
let ticket = false;
let ticketExpiresAt = false;
let accessToken = false;
let tokenExpiresAt = false;

router.get('/test',(req,res) => {
	var xml = `<xml>
<ToUserName><![CDATA[toUser]]></ToUserName>
<FromUserName><![CDATA[FromUser]]></FromUserName>
<CreateTime>123456789</CreateTime>
<MsgType><![CDATA[event]]></MsgType>
<Event><![CDATA[subscribe]]></Event>
</xml>`;
	parseString(xml, function (err, result) {
	    console.dir(result);
	});
	res.send('ok');
});

// 接受事件
router.post('/event',(req,res) => {
	console.log('-----------------body---------------');
	console.log(req.body);
	console.log('------------------------------------');
	console.log(req.params);
	console.log('----------------params--------------');
	res.send('');
});

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

router.get('/openid',(req,res) => {
	let code = req.query.code;
	let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.weixin.AppID}&secret=${config.weixin.AppSecret}&code=${code}&grant_type=authorization_code `;
	request(url).then(result => {
		console.log(result);
		res.send(result);
	});
});

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
