export class U77login {
	constructor() {
		this.loginTemplate = `
		<div id="u77-login">
			<div class="cover" onclick="base.u77login.closeLoginBox()"></div>
			<div class="login-box">
				<h1 class="title">U77总有好游戏</h1>
				<div class="tab active" data-id=1>
					<div class="third-login">
						<a href="http://www.u77.com/account/login_qq?forward={{curentUrl}}" class="qq">
							<i class="fa fa-qq"></i>
							<span>QQ登陆</span>
						</a>
						<a href="http://www.u77.com/account/login_sina?action=jump&forward={{curentUrl}}" class="weibo">
							<i class="fa fa-weibo"></i>
							<span>微博登陆</span>
						</a>
					</div>
					<a class="switch" onclick="base.u77login.switcher()">U77账号密码登陆</a>
				</div>
				<div class="tab " data-id=2>
					<form class="login-form" method="post" action="http://www.u77.com/gamegate/egret_login/<?=$id?>">
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
		this.openLoginBox();

	}

	async isLogin() {
		let result = await $.get('http://www.u77.com/api/isLogin');
		try {
			result = JSON.parse(result);
		}catch(e) {
			this.user = false;
			return false;
		}
		alert(result.status);
		if(result.status == 101)this.user = false;
		if(result.status == 100)this.user = {
			userId:result.userid,
			nickname:result.nickname,
			avatar:"http://img.u77.com/avatar/"+result.avatar
		}
		return this.user;
	}

	openLoginBox() {
		$('body').append(this.loginTemplate.replace(/{{curentUrl}}/g,window.location.href));
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