import {BaseClass} from './baseClass.js';

export class U77login extends BaseClass{
	constructor() {
		super();
		this.loginTemplate = `
		<div id="u77-login">
			<div class="cover" onclick="base.u77login.closeLoginBox()"></div>
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
					<a class="switch" onclick="base.u77login.switcher()">U77账号密码登陆</a>
				</div>
				<div class="tab " data-id=2>
					<form class="login-form" method="post" action="http://www.u77.com/api/wx_login" onsubmit="return base.u77login.loginSubmit()">
						<input type="text" name="username" placeholder="请输入邮箱地址">
						<input type="password" name="password" placeholder="请输入密码">
						<button class="submit" type="submit">登陆</button>
					</form>
					<a class="switch" onclick="base.u77login.switcher()">第三方快捷登陆</a>
				</div>
			</div>
		</div>
		`;
		this.isLogin();
		this.checkLoginStatus();
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

	checkLoginStatus() {
		let code = this.GetQueryString('loginerrorcode');
		if(code) {
			code = parseInt(code);
			
		}
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
}