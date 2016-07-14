import {Router} from 'express';
import config from '../config.js';
import moment from "moment";
import request from 'request-promise';

let router = Router();
let ticket = false;
let ticketExpiresAt = false;
let accessToken = false;
let tokenExpiresAt = false;

let path = 'http://ldev.u77wx.leanapp.cn/';

router.get('/test',(req,res) => {
	let redirect = `${path}weixin/openid`;
	redirect = encodeURIComponent(redirect);
	let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.weixin.ServerAppID}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=server#wechat_redirect`;
	res.redirect(url);
});

router.get('/lead/:name',(req,res) => {
	if(checkWechatBroswer(req.headers['user-agent'])){
		let name = req.params.name;
		let state = 'default';
		let redirect = `${path}server-weixin/activity/${name}`;
		redirect = encodeURIComponent(redirect);
		let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.weixin.ServerAppID}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
		res.redirect(url);
	}else {
		res.render('pc/'+req.params.name+'.html');
	}
});

router.get('/lead/:name/:state',(req,res) => {
	if(checkWechatBroswer(req.headers['user-agent'])){
		let name = req.params.name;
		let state = req.params.state;
		let redirect = `${path}server-weixin/activity/${name}`;
		redirect = encodeURIComponent(redirect);
		let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.weixin.ServerAppID}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
		res.redirect(url);
	}else {
		res.render('pc/'+req.params.name+'.html');
	}
});

router.get('/activity/:name',(req,res) => {
	let code = req.query.code;
	let name = req.params.name;
	let state = req.query.state || 'default';
	getUnionId(code).then(unionId => {
		if(unionId){
			res.render(name+'/index.html',{
				unionId,
				state
			});	
		}else {
			res.redirect(`/server-weixin/lead/${name}/${state}`);
		}
	});
});

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

function checkWechatBroswer(agant) {
	if(agant.indexOf('MicroMessenger') != -1)return true;
	return false;
}

async function getUnionId(code) {
	let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.weixin.ServerAppID}&secret=${config.weixin.ServerAppSecret}&code=${code}&grant_type=authorization_code `;
	let result = await request(url);
	try {
		result = JSON.parse(result);
	}catch(e) {
		console.log(e);
	}
	if(result.openid){
		let detail = await fetchDetail(result.openid);
		return detail.unionid;
	}else {
		return false;
	}
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
	let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.weixin.ServerAppID}&secret=${config.weixin.ServerAppSecret}`;
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
