import {Router} from 'express';
import request from 'request-promise';
import moment from "moment";
import config from '../config.js';
let router = Router();

router.get('/check/:unionId',(req,res) => {
	let query = new global.AV.Query('WechatUser');
	query.equalTo('unionid',req.params.unionId);
	query.first().then(user => {
		res.send(user);
	});
});

export default router;
