import {BaseClass} from './baseClass.js';

let path = "http://192.168.1.105:3000/";

export class User extends BaseClass{

	constructor() {
		super();
		this.loginTemplate = `
		<div id="u77-login">
			<div class="cover" onclick="base.user.closeLoginBox()"></div>
			<div class="login-box">
				<h1 class="title">U77总有好游戏</h1>
				<div class="tab active" data-id=1>
					<div class="third-login">
						<a href="http://www.u77.com/account/login_qq?forward={{currentUrl}}" class="qq">
							<i class="fa fa-qq"></i>
							<span>QQ登陆</span>
						</a>
						<a href="http://www.u77.com/account/login_sina?action=jump&forward={{currentUrl}}" class="weibo">
							<i class="fa fa-weibo"></i>
							<span>微博登陆</span>
						</a>
					</div>
					<a class="switch" onclick="base.user.switcher()">U77账号密码登陆</a>
				</div>
				<div class="tab " data-id=2>
					<form class="login-form" method="post" action="http://www.u77.com/api/wx_login" onsubmit="return base.user.loginSubmit()">
						<input type="text" name="username" placeholder="请输入邮箱地址">
						<input type="password" name="password" placeholder="请输入密码">
						<button class="submit" type="submit">登陆</button>
					</form>
					<a class="switch" onclick="base.user.switcher()">第三方快捷登陆</a>
				</div>
			</div>
		</div>
		`;
		this.isLogin().then(user => {
			this.renderHeader();
		});

		this.unionId = $('#u77-unionid').val();
	}

	renderHeader() {
		let navTemplate = `
		<div class="nav">
			<span class="icon"><i class="fa fa-plus-square-o"></i></span>
			<div class="menu">
				<i class="angle fa fa-caret-up"></i>
				<div class="wrap">
					<div class="item game">
						<i class="fa fa-gamepad"></i>
						<span class="text">游戏</span>
						<div class="sub-menu">
							<i class="sub-angle fa fa-caret-right"></i>
							<div class="sub-wrap">
								<div class="sub-item">
									<span class="text">萌神赵子龙</span>
								</div>
								<div class="sub-item">
									<span class="text">艾德尔冒险</span>
								</div>
							</div>
						</div>
					</div>
					<div class="item activities">
						<i class="fa fa-list"></i>
						<span class="text">活动</span>
						<div class="sub-menu">
							<i class="sub-angle fa fa-caret-right"></i>
							<div class="sub-wrap">
								<div class="sub-item">
									<a href="${path}server-weixin/lead/seven-mark" class="text">萌神签到礼包</a>
								</div>
								<div class="sub-item">
									<a href="${path}server-weixin/lead/share" class="text">萌神分享礼包</a>
								</div>
							</div>
						</div>
					</div>
					<div class="item code-box" onclick="base.user.openCodeBox()">
						<i class="fa fa-gift"></i>
						<span class="text">礼包盒</span>
					</div>
				</div>
			</div>
		</div>
		`;

		let userTemplate = `
		<div class="user">
			<img class="avatar" src="{{avatar}}">
			<span class="nickname">{{nickname}}</span>
			<div class="menu">
				<i class="angle fa fa-caret-up"></i>
				<div class="wrap">
					<div class="item logout">
						<i class="fa fa-sign-out"></i>
						<span class="text">登出</span>
					</div>
				</div>
			</div>
		</div>
		`;

		let noUserTemplate = `
		<div class="user" onclick="base.user.openLoginBox()">
			<i class="fa fa-user"></i>
			<span class="nickname">U77账号登陆</span>
		</div>
		`;

		if(this.user && this.user.userId) {
			$('#u77-header').html(userTemplate
				.replace(/{{avatar}}/g,this.user.avatar)
				.replace(/{{nickname}}/g,this.user.nickname)+navTemplate
			);
		}else {
			$('#u77-header').html(noUserTemplate + navTemplate);
		}
	}

	loginSubmit() {
		$.ajax({
			url:'http://www.u77.com/api/wx_login',
			type:'POST',
			data:{
				username:$('#u77-login input[name="username"]').val(),
				password:$('#u77-login input[name="password"]').val()
			},
			dataType:'json',
			xhrFields: {
				withCredentials: true,
			},
			success:data => {
				if(status == 100)window.location.reload();
				let code = parseInt(data.error_code);
				switch(code){
					case 1:
						alert('请输入用户名');
						break;
					case 2:
						alert('请输入密码');
						break;
					case 4:
						alert('账户名不存在');
						break;
					case 5:
						alert('密码错误');
						break;
				}	
			}
		});
		return false;
	}

	async isLogin() {
		let result = await new Promise((resolve,reject) => {
			$.ajax({
				url:'http://www.u77.com/api/isLogin',
				xhrFields: {
					withCredentials: true,
				},
				success:data => {
					resolve(data);					
				}
			});
		})
		try {
			result = JSON.parse(result);
		}catch(e) {
			this.user = false;
			return false;
		}
		if(result.status == 101)this.user = false;
		if(result.status == 100)this.user = {
			userId:result.userid,
			nickname:result.nickname,
			avatar:"http://img.u77.com/avatar/"+result.avatar
		}
		return this.user;
	}

	openLoginBox() {
		$('body').append(this.loginTemplate.replace(/{{currentUrl}}/g,window.location.href));
	}

	closeLoginBox() {
		$('#u77-login').remove();
	}

	switcher() {
		switch($('#u77-login .tab.active').data('id')) {
			case 1:
				$('#u77-login .tab.active').removeClass('active');
				$('#u77-login .tab[data-id=2]').addClass('active');
				break;
			case 2:
				$('#u77-login .tab.active').removeClass('active');
				$('#u77-login .tab[data-id=1]').addClass('active');
				break;
		}
	}

	openCodeBox() {
		let codeBoxTemplate = `
		<div id="u77-code-box">
			<div class="cover" onclick="base.user.closeCodeBox()"></div>
			<div class="box">
				<h2 class="title">获得的激活码</h2>
				<div class="table">
					<div class="desc">
						<span class="name">礼包名称</span>
						<span class="code">激活码</span>
					</div>
					<div class="list">
						<div class="loading"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>
					</div>
				</div>
			</div>
		</div>
		`;

		let itemTemplate = `
		<div class="item">
			<span class="name">{{name}}</span>
			<span class="code">{{code}}</span>
		</div>
		`;

		$('body').append(codeBoxTemplate);
		$.get(path+'gift/find',{unionId:this.unionId},result => {
			if(result.status == 100){
				let template = '';
				$.map(result.list,item => {
					template += itemTemplate.replace(/{{name}}/g,item.detail).replace(/{{code}}/g,item.code);
				});
				$('#u77-code-box .box .table .list').html(template);
			}else {
				alert('获取抽奖记录失败,请刷新重试.');
			}
		})
	}

	closeCodeBox() {
		$('#u77-code-box').remove();
	}
}