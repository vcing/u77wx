import {BaseClass} from '../base/baseClass.js';
import moment from 'moment';

let path = window.path;

export class Share extends BaseClass {
	constructor() {
		super();
		this.unionId = $('#u77-unionid').val();
		this.state = $('#u77-state').val();
		this.initState();
		this.checkState();
		this.paperOpen = false;
	}

	async draw() {
		if(this.paperOpen) {
			this.machineReset();
			this.paperOpen = false;
			return;
		}
		if(this.count <= 0){
			alert('抽奖次数已经用完了,赶快分享获取更多抽奖机会吧.');
			return;
		}
		this.count--;
		$('#u77-share .lottery .machine .times').text(this.count);
		this.brokenAnimate();
		let result = await $.get(path+'lottery',{unionId:this.unionId});
		let award = "";
		result.count = parseInt(result.count);
		switch(result.count) {
			case 1:
				award=`<img src="http://file.u77.com/weixin/msicon/lb.png" width="50">*1`;
				break;
			case 2:
				award=`<img src="http://file.u77.com/weixin/msicon/ctm.png" width="50">*1`;
				break;
			case 3:
				award=`<img src="http://file.u77.com/weixin/msicon/szbf.png" width="50">*1`;
				break;
			case 4:
				award=`<img src="http://file.u77.com/weixin/msicon/gjzml.png" width="50">*2`;
				break;
			case 5:
				award=`<img src="http://file.u77.com/weixin/msicon/jys.png" width="50">*2`;
				break;
			case 6:
				award=`<img src="http://file.u77.com/weixin/msicon/zml.png" width="50">*2`;
				break;
			case 7:
				award=`<img src="http://file.u77.com/weixin/msicon/sxf.png" width="50">*5`;
				break;
			case 8:
				award=`<img src="http://file.u77.com/weixin/msicon/jh.png" width="50">*50`;
				break;
			case 9:
				award=`<img src="http://file.u77.com/weixin/msicon/xll.png" width="50">*5`;
				break;
			default:
				break;
		}
		$('#u77-share .lottery .machine .entry .paper .prize').html(award);
		$('#u77-share .lottery .machine .entry .paper .code').html(result.code);
		this.paperOpen = true;
		this.showPaper();
	}

	showPaper() {
		$('#u77-share .lottery .machine .entry .paper').animate({
			top:0
		},3000);
	}

	checkState() {
		if(this.state != 'default') {
			$.get(path+'share/join',{
				shareUnionId:this.state,
				joinUnionId:this.unionId,
				time:moment().unix()
			});
		}
	}

	async initState() {
		let count = await $.get(path+'lottery/init',{unionId:this.unionId});
		this.count = count;
		$('#u77-share .lottery .machine .times').text(count);
	}

	brokenAnimate() {
		this.ball  = $('#u77-share .lottery .rocker .ball');
		this.hPole = $('#u77-share .lottery .rocker .h-pole');
		this.vPole = $('#u77-share .lottery .rocker .v-pole');

		this.ballBottom  = this.ball.css('bottom');
		this.ballLeft    = this.ball.css('left');
		this.hPoleBottom = this.hPole.css('bottom');
		this.hPoleLeft   = this.hPole.css('left');
		this.vPoleBottom = this.vPole.css('bottom');
		this.vPoleLeft   = this.vPole.css('left');

		this.fallAnimate(this.ball);
		this.fallAnimate(this.hPole);
		this.fallAnimate(this.vPole);
	}

	fallAnimate(dom,height = 0) {
		// dom.addClass('animate-rotate');
		this._fall(dom,height)();
	}

	_fall(dom,height = 0) {
		let ease = 'swing';
		return () => {
			if(height == 0)height = dom.css('bottom');
			height = parseInt(height);
			if(height < 10)return;
			height /= 2;
			let left = dom.css('left');
			left = parseInt(left);
			let angle = Math.random() * 50; 
			let leftOffset = (0.5-Math.random())*100

			dom.animate({bottom:0,left:(left - leftOffset/2)+'px','-webkit-transform':`rotate(${angle}deg)`},300,ease,() => {
				dom.animate({bottom:height+'px',left:(left - leftOffset/2)+'px','-webkit-transform':`rotate(${angle}deg)`},300,ease,this._fall(dom,height));
			});
		}
	}

	machineReset() {
		this.ball.animate({left:this.ballLeft,bottom:this.ballBottom},300,'swing');
		this.hPole.animate({left:this.hPoleLeft,bottom:this.hPoleBottom},300,'swing');
		this.vPole.animate({left:this.vPoleLeft,bottom:this.vPoleBottom},300,'swing');
		$('#u77-share .lottery .machine .entry .paper').animate({
			top:"-100%"
		},2000);
	}

	shareSuccess(type) {
		$.get(path+'share',{
			unionId:this.unionId,
			from:type,
			time:moment().unix()
		},(result) => {
			if(result.status == 100){
				this.count++;
				$('#u77-share .lottery .machine .times').text(this.count);
				return;
			}else if(result.status == 110) {

			}else {
				window.location.reload();
			}
		});
	}
}