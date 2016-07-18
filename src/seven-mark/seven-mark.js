import {BaseClass} from '../base/baseClass.js';

let path = `${window.path}gift/`;

export class Seven extends BaseClass {
	constructor() {
		super();
		setTimeout("base.seven.initLine()",2000);
		this.unionId = $('#u77-unionid').val();
		this.initState();
	}

	async initState() {
		let result = false;
		try {
			result = await $.get(path+'daily-count',{unionId:this.unionId});
			console.log(result);
		}catch (e) {
			console.log(e);
			alert('获取礼包信息失败,请刷新重试.');
			return false;
		}
		if(!result) {
			alert('获取礼包信息失败,请刷新重试.');
			return false;
		}
		this.count = result.count;
		for (let i = 1;i <= this.count; i++) {
			$('#u77-seven-mark .mark .seven .point-'+i).addClass('active');
		}

		$('#u77-seven-mark .mark .present').attr('src',`http://file.u77.com/weixin/libao-0${this.count}.png`);
	}

	async mark() {
		let result = false;
		try {
			result = $.get(path+'daily',{unionId:this.unionId});
		}catch (e) {
			console.log(e);
			alert('获取礼包码失败,请刷新重试.');
			return false;
		}
		if(!result) {
			alert('获取礼包码失败,请刷新重试.');
			return false;
		}
		console.log(result);
	}

	initLine() {
		let wrap = $('#u77-seven-mark .mark .seven');
		for(let i = 1;i<7;i++) {
			let pointOne = $('#u77-seven-mark .mark .seven .point-'+i);
			let pointTwo = $('#u77-seven-mark .mark .seven .point-'+(i+1));
			this.drawLine(pointTwo,pointOne,wrap);
		}
	}

	drawLine(a,b,wrap) {
		let lineC = Math.abs(b.position().left - a.position().left);
		let lineA = Math.abs(b.position().top - a.position().top);
		let lineB = Math.sqrt(lineA*lineA + lineC*lineC);
		
		let width = lineB;

		let _d = lineB*lineB + lineC*lineC - lineA*lineA;
		let _b = 2 * lineB * lineC;
		let angle = Math.acos(_d/_b);
		angle = angle/Math.PI * 180;

		let middleAx = a.position().left + a.outerWidth()/2;
		let middleAy = a.position().top + a.outerHeight()/2;
		let middleBx = b.position().left + b.outerWidth()/2;
		let middleBy = b.position().top + b.outerHeight()/2;
		let middlePx;
		let middlePy;
		let leftPoint;
		let rightPoint;
		if(middleAx < middleBx) {
			middlePx = middleAx + (middleBx - middleAx)/2;
			leftPoint = a;
			rightPoint = b;
		}else {
			middlePx = middleBx + (middleAx - middleBx)/2;
			leftPoint = b;
			rightPoint = a;
		}

		if(middleAy < middleBy) {
			middlePy = middleAy + (middleBy - middleAy)/2;
		}else {
			middlePy = middleBy + (middleAy - middleBy)/2;
		}

		if(leftPoint.position().top > rightPoint.position().top) {
			angle = -angle;
		}

		middlePx -= lineB/2;
		
		let template = `<div class="line" style="left:{{x}}px;top:{{y}}px;width:{{width}}px;transform:rotate({{angle}}deg)"></div>`;

		wrap.append($(template.replace(/{{x}}/g,middlePx).replace(/{{y}}/g,middlePy).replace(/{{width}}/g,lineB).replace(/{{angle}}/g,angle)));
	}

	async showMark(day) {
		let markTemplate = `
		<div id="u77-seven-dialog">
			<div class="cover" onclick="base.seven.closeMark()"></div>
			<div class="wrap">
				<img class="bg" src="http://file.u77.com/weixin/tk.png" width="100%">
				<div class="code"><span>激活码获取中...</span></div>
				<a class="copy">长按激活码->选择复制->复制</a>
				<a class="start-game" href="http://www.u77.com/gamegate/egret_login/90492"><img src="http://file.u77.com/weixin/jryx.png"></a>
			</div>
		</div>
		`;
		if(day > this.count + 1) {
			alert('前一天的还没签呢~~~');
			return;
		}

		$('body').append(markTemplate);
		let result = await $.get(path+'daily',{unionId:this.unionId,count:day});
		if(result.status == 100) {
			if(!$('#u77-seven-mark .mark .seven .point-'+day).hasClass('active')) {
				$('#u77-seven-mark .mark .seven .point-'+day).addClass('active');
				$('#u77-seven-mark .mark .present').attr('src',`http://file.u77.com/weixin/libao-0${day}.png`);
			}
			this.count++;
			$('#u77-seven-dialog .code span').text(result.code);
		}else if(result.status == 104){
			this.closeMark();
			alert('今日已经领过了哟,明天再来吧.');
		}else {
			this.closeMark();
			alert('领取礼包失败,请刷新重试');
		}
	}

	closeMark() {
		$('#u77-seven-dialog').remove();
	}
}