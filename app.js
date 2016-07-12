
/**
 * U77微信系统
 *
 * @author Vcing
 * @Date(2016/07/08)
 */

'use strict';

import config from './config.js';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './app/index.js';
import templateHelper from './app/template.js';
import AV from 'leanengine';

let app = express();

// leancloud 初始化
AV.init({appId:process.env.LEANCLOUD_APP_ID || config.LEANCLOUD_APP_ID,
		appKey:process.env.LEANCLOUD_APP_KEY || config.LEANCLOUD_APP_KEY,
		masterKey:process.env.LEANCLOUD_APP_MASTER_KEY || config.LEANCLOUD_APP_MASTER_KEY});
AV.Cloud.useMasterKey();
global.AV = AV;

// 使用 LeanEngine 中间件
app.use(AV.express());

// 模型类 全局定义
global.WechatUser = AV.Object.extend('WechatUser');

// 模板引擎设置
app.set('views', './dest');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// 跨域支持
app.use((req,res,next) => {
	let origin = req.headers.origin;
	if (config.whiteOrigins.indexOf(origin) !== -1) {
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
	}
	next();
});

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	type: (req) => /x-www-form-urlencoded/.test(req.headers['content-type']),
	extended: false
}));

// 模板引擎helper
templateHelper(app);

// 跨域支持
app.all('/*', (req, res, next) => {
	var origin = req.headers.origin;
	if (config.whiteOrigins.indexOf(origin) !== -1) {
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
	}
	next();
});

// 静态目录
app.use('/static', express.static(__dirname + '/dest'));

// 路由
app.use(router);

app.get('/',function(req,res){
	res.redirect('http://www.u77.com');
});

module.exports = app;