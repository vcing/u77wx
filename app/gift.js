import {Router} from 'express';
import moment from "moment";
import crypto from 'crypto';
import request from 'request-promise';

let router = Router();



router.get("/",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	let name = params.name;

	if(!name){
		res.send({
			status:102,
			msg:"礼包名为空"
		});
	}

	if(user){
		getGift(user,name).then((result) => {
			res.send(result);
		});
	}else{
		res.send({
			status:101,
			msg:"用户为空"
		});
	}
});

router.get("/find",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	let sign = params.sign;
	let count = params.count;
	
	if(user){
		getMyGift(user,sign,count).then((result) => {
			res.send(result);
		})
	}else{
		res.send({
			status:101,
			msg:"用户为空"
		});
	}

});

router.get("/daily-count",(req,res) => {
	let params = req.query;
	let user = params.unionId;

	if(user){
		getGiftCount(user,"daily").then((count) => {
			res.send({
				count:count
			});
		});
	}else{
		res.send({
			status:101,
			msg:"用户为空"
		});
	}

})
	


router.get("/daily",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	let count = params.count;
	if(user){
		getDailyGift(user,count).then((result) => {
			res.send(result);
		});
	}else{
		res.send({
			status:101,
			msg:"用户为空"
		});
	}

});

async function getGiftCount(user,sign){
	let query = new AV.Query('Gift');
	let count = 0;
	query.equalTo('user', user);
	if(sign){
		query.equalTo('sign', sign);
	}
	query.descending('count');
	let result = await query.first();
	if(result){
		count = result.get("count");
	}
	return count;
}

async function getMyGift(user,sign,count){
	let query = new AV.Query('Gift');
	query.equalTo('user', user);
	if(sign){
		query.equalTo('sign', sign);
	}
	if(count){
		query.equalTo('count', count);
	}	
	query.descending('createdAt');
	let list = await query.find();
	let giftList = [];
	for(let gift of list){
		let detail = "";
		if(gift.get("sign") == "daily"){
			detail += "7日礼包-"+gift.get("count");
		}else if(gift.get("sign") == "lottery"){
			detail += "抽奖-"+gift.get("count")+"等奖";
		}else{
			//其他
		}
		giftList.push({
			code:gift.get("code"),
			detail:detail,
			time:moment.unix(gift.get("time")).format("YYYY-MM-DD HH:mm")
		});
	}

	return {
		list:giftList,
		status:100,
		msg:"ok"
	};
}

async function getDailyGift(user,count){
	let query = new AV.Query('Gift');
	let sign = "daily";
	let getCode = true;
	let maxCount = 0;
	let time = moment().unix().toString();
	let code = "";
	query.equalTo('user', user);
	query.equalTo('sign', sign);
	query.descending('createdAt');
	let result = await query.find();
	if(result && result.length > 0){
		maxCount = result[0].get("count");
		let lastTime = result[0].get("time");
		if(moment.unix(lastTime).format("YYYY-MM-DD") == moment.unix(time).format("YYYY-MM-DD")){
			getCode = false;
		}
	}

	if(count <= maxCount){
		for(let gift of result){
			if(count == gift.get("count")){
				code = gift.get("code");
			}
		}
	}else{
		if(getCode && (count == maxCount + 1) ){
			let gift = await getGift(user,"mszzl-daily-"+count);
			if(gift && gift.status == 100){
				code = gift.code;
			}else{
				return gift;
			}
		}else{
			return {
				status:104,
				msg:"今天已领取礼包"
			}
		}
	}

	return {
		code:code,
		status:100,
		msg:"ok"
	};

}

async function getGift(user,name){
	let url = "http://u77pay.leanapp.cn/api/gift";
	let gifts = JSON.parse(await request(url));
	let curGift = "";
	for(let gift of gifts){
		if(name == gift.name){
			curGift = gift;
		}
	}
	if(curGift){
		let giftUser = user;
		if(name.split("-")[1] == "lottery"){
			giftUser = user + "-" + moment().unix();
		}
		let secure = crypto.createHash('md5').update(giftUser+"u77giftheheda", 'utf-8').digest('hex');
		let codeUrl = "http://u77pay.leanapp.cn/api/gift/fetch?userId="+giftUser+"&secure="+secure+"&gift="+curGift.objectId;
		let result = JSON.parse(await request(codeUrl));
		if(result && result.status == 100){
			let code = result.code;
			saveGift(user,name,code);
		}
		return result;
	}else{
		return {
			status:103,
			msg:"礼包获取错误,请重新获取",
		}
	}
}

async function saveGift(user,name,code){
	let query = new AV.Query('Gift');
	query.equalTo('user', user);
	query.equalTo('code', code);
	let result = await query.first();
	if(!result){

		let option = name.split("-");
		let count = parseInt(option[2]);
		let sign = option[1];
		let game = option[0];
		let gift = new global.Gift();
		gift.set("user",user);
		gift.set("count",count);
		gift.set("sign",sign);
		gift.set("code",code);
		gift.set("game",game);
		gift.set("time",moment().unix().toString());
		
		gift.save();
	}

	return;
}

export default router;