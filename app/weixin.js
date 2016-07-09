import {Router} from 'express';
import config from '../config.js';
import moment from "moment";
import request from 'request-promise';

let router = Router();
let ticket = false;
let ticketExpiresAt = false;
let accessToken = false;
let tokenExpiresAt = false;

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