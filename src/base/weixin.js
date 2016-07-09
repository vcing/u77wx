import moment from 'moment';
import crypto from 'crypto';

export class Weixin{
	constructor() {

	}

	async init() {
		if(window.wx){
			let options = {
			    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: 'wx84229c9e9d6926f8', // 必填，公众号的唯一标识
			    timestamp: moment().unix(), // 必填，生成签名的时间戳
			    nonceStr: 'u77wxbytyanddcc', // 必填，生成签名的随机串
			    signature: '',// 必填，签名，见附录1
			    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			}

			let result;
			try {
				result = await $.get('/weixin/ticket-api');
			}catch(e) {
				return {err:'get weixin ticket err',msg:'获取微信ticket失败,请稍候重试.(101)'};
			}

			if(result.err){
				return {err:result.err,msg:'微信ticket失败,请稍候重试.(102)'};
			}

			let jsapi_ticket = result.ticket;

			options.signature = this.getSignature(options,jsapi_ticket);

			wx.config(options);

			return await new Promise((resolve,reject) => {
				wx.ready(() => {
					resolve({msg:'ok'});
				});
				wx.error((err) => {
					resolve({msg:'微信SDK配置加载失败',err:err});
				})
			});
			
		}else{
			return {err:'weixin sdk not load.',msg:'微信SDK未能加载'};
		}
	}

	getSignature(options,jsapi_ticket){
		let url = window.location.href.split('#')[0];
		let str = `jsapi_ticket=${jsapi_ticket}&noncestr=${options.nonceStr}&timestamp=${options.timestamp}&url=${url}`;
		console.log(str);
		return crypto.createHash('sha1').update(str, 'utf-8').digest('hex');
	}
}