import {Weixin} from './weixin.js';

export class Base {
	constructor() {
		this.init();
	}

	async init() {
		this.weixin = new Weixin();
	}
}

$(function(){
	window.base = new Base();	
})