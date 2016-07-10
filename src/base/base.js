import {Weixin} from './weixin.js';

export class Base {
	constructor() {
		this.init().then(result => {

		});
	}

	async init() {
		this.weixin = new Weixin();
		let weixinReadyResult = await this.weixin.init();
		if(weixinReadyResult.err) {
			alert(weixinReadyResult.msg);
			return false;
		}
		// 非微信浏览器
		if(weixinReadyResult.notWeixin) {
			return await this.initPC();
		}
		// 检测API
		let apiResult = await this.weixin.checkApi();
		if(apiResult.err) {
			alert(apiResult.msg);
			return false;
		}
		return true;
	}

	async initPC() {
		console.log('in PC');
	}
}

$(function(){
	window.base = new Base();	
})