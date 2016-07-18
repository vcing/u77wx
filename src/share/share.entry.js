import {Base} from '../base/base.js';
import {Share} from './share.js';

$(async function(){
	window.base.share = new Share();
	let path = window.path+"server-weixin/lead/share/"+$('#u77-unionid').val();
	await window.base.weixin.init();
	wx.onMenuShareTimeline({
	    title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
	    link: path, // 分享链接
	    imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	        window.base.share.shareSuccess('circle');
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
	wx.onMenuShareAppMessage({
	    title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
	    desc: '无脑策划又开始瞎TM送礼品了.', // 分享描述
	    link: path, // 分享链接
	    imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
	    type: 'link', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	        window.base.share.shareSuccess('friend');
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});

	wx.onMenuShareQQ({
	    title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
	    desc: '无脑策划又开始瞎TM送礼品了.', // 分享描述
	    link: path, // 分享链接
	    imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	       // 用户取消分享后执行的回调函数
	    }
	});

	wx.onMenuShareQZone({
	    title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
	    desc: '无脑策划又开始瞎TM送礼品了.', // 分享描述
	    link: path, // 分享链接
	    imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
})