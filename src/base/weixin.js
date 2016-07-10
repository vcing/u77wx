import moment from 'moment';
import crypto from 'crypto';

export class Weixin{
	constructor() {
		this.ready = false;
		this.appId = 'wx84229c9e9d6926f8';
		this.apiList = [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone'
		]
	}

	async init() {
		if(!this.isWeixin()){
			this.ready = false;
			return {notWeixin:true,msg:'非微信浏览器'};
		}
		if(window.wx){
			let options = {
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: this.appId, // 必填，公众号的唯一标识
			    timestamp: moment().unix(), // 必填，生成签名的时间戳
			    nonceStr: 'u77wxbytyanddcc', // 必填，生成签名的随机串
			    signature: '',// 必填，签名，见附录1
			    jsApiList: this.apiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			}

			let result;
			try {
				result = await $.get('/weixin/ticket-api');
			}catch(e) {
				return {err:'get weixin ticket err',msg:'获取微信ticket失败,请刷新重试.(101)'};
			}

			if(result.err){
				return {err:result.err,msg:'微信ticket失败,请刷新重试.(102)'};
			}

			let jsapi_ticket = result.ticket;

			options.signature = this.getSignature(options,jsapi_ticket);

			return await new Promise((resolve,reject) => {
				wx.ready(() => {
					this.ready = true;
					resolve({msg:'ok'});
				});
				wx.error((err) => {
					this.ready = false;
					resolve({msg:'微信SDK配置加载失败,请刷新重试.',err:err});
				});
				wx.config(options);
			});
		}else{
			this.ready = false;
			return {err:'weixin sdk not load.',msg:'微信SDK未能加载,请刷新重试.'};
		}
	}

	getSignature(options,jsapi_ticket){
		let url = window.location.href.split('#')[0];
		let str = `jsapi_ticket=${jsapi_ticket}&noncestr=${options.nonceStr}&timestamp=${options.timestamp}&url=${url}`;
		return crypto.createHash('sha1').update(str, 'utf-8').digest('hex');
	}

	checkApi() {
		return new Promise((resolve,reject) => {
			if(!this.ready){
				resolve({err:'weixin sdk not ready.',msg:'微信检查API失败,SDK尚未就绪,请刷新重试.'});
				return false;
			}

			wx.checkJsApi({
				jsApiList:this.apiList,
				success:res => {
					if(res.errMsg == 'checkJsApi:ok' && res.checkResult.onMenuShareTimeline == true){
						resolve({msg:'ok'});
					}else {
						resolve({msg:'检查微信API未通过,使用新版微信打开本页面,请刷新重试.',err:'api check failed'});
					}
				}
			})
		});
	}

	isWeixin(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
			return true;
	 	} else {
			return false;
		}
	}

	getAuth() {
		let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&scope=snsapi_base&state=u77wx#wechat_redirect`;
		window.location.href = url;
	}
}