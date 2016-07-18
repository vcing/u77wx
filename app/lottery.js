import {Router} from 'express';
import moment from "moment";
import crypto from 'crypto';
import request from 'request-promise';
import config from '../config.js';

let router = Router();
let path = config.local;

router.get("/",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	if(user){
		lottery(user).then((result) => {
			res.send(result);
		});
	}else{
		res.send({
			status:104,
			msg:"用户为空"
		});
		return;
	}
});

router.get("/init",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	if(user){
		lotteryInit(user).then((result) => {
			res.send(result.get("num").toString());
		});
	}else{
		res.send({
			status:101,
			msg:"用户为空"
		});
		return;
	}
});

async function lotteryInit(user){
	let query = new AV.Query('Lottery');
	query.equalTo('user', user);
	let lottery = await query.first();
	let time = moment().unix().toString();

	if(lottery){
		let lastTime = lottery.get("time");
		let num = lottery.get("num");
		if(time && moment.unix(time).format("YYYY-MM-DD") == moment.unix(lastTime).format("YYYY-MM-DD")){
			return lottery;
		}else{
			lottery.set("num",num+5);
			lottery.set("time",time);
			return await lottery.save();
		}
	}else{
		let Lottery = global.Lottery;

		let newLottery = new Lottery();
		newLottery.set("user",user);
		newLottery.set("num",5);
		newLottery.set("time",time);

		return await newLottery.save();
	}
}

async function lottery(user) {
	let query = new AV.Query('Lottery');
	query.equalTo('user', user);
	let result = await query.first();
	if(result){
		let num = result.get("num");
		if(num > 0){
			result.set("num",num-1);
			try{
				await result.save();
				let giftName = getRand();
				let count = giftName.split("-")[2];

				let url = path+"gift?unionId="+user+"&name="+giftName;
				let gift = JSON.parse(await request(url));

				if(gift && gift.status == 100){
					gift["count"] = count;
				}
				return gift;
			}catch(e){
				return {
					status:105,
					msg:"礼包获取错误"
				};
			}
		}else{
			return {
				status:106,
				msg:"抽奖次数不足"
			}
		}
	}else{
		return {
			status:107,
			msg:"用户不存在"
		}
	}
}

function getRand(){
	let rand = Math.random()*1000;
	let name = "";
	if(rand >= 999 && rand<1000){
		name = "mszzl-lottery-1";
	}else if(rand >= 959 && rand<999){
		name = "mszzl-lottery-2";
	}else if(rand >= 919 && rand<959){
		name = "mszzl-lottery-3";
	}else if(rand >= 819 && rand<919){
		name = "mszzl-lottery-4";
	}else if(rand >= 719 && rand<819){
		name = "mszzl-lottery-5";
	}else if(rand >= 569 && rand<719){
		name = "mszzl-lottery-6";
	}else if(rand >= 419 && rand<569){
		name = "mszzl-lottery-7";
	}else if(rand >= 269 && rand<419){
		name = "mszzl-lottery-8";
	}else{
		name = "mszzl-lottery-9";
	}

	return name;
}

// async function addChance(user) {
// 	let query = new AV.Query('Lottery');
// 	query.equalTo('user', user);
// 	let lottery = await query.first();
// 	if(lottery){
// 		let num = lottery.get("num");
// 		lottery.set("num",num+);
// 		return await lottery.save();
// 	}else{
// 		return {
// 			status:107,
// 			msg:"用户不存在"
// 		}
// 	}
// }

export default router;