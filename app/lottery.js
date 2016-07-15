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

	if(lottery){
		return lottery;
	}else{
		let Lottery = global.Lottery;

		let newLottery = new Lottery();
		newLottery.set("user",user);

		return newLottery.save();
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
	let rand = Math.random()*100;
	let name = "";
	if(rand >= 98 && rand<100){
		name = "mszzl-lottery-1";
	}else if(rand >= 94 && rand<98){
		name = "mszzl-lottery-2";
	}else if(rand >= 90 && rand<94){
		name = "mszzl-lottery-3";
	}else if(rand >= 80 && rand<90){
		name = "mszzl-lottery-4";
	}else if(rand >= 70 && rand<80){
		name = "mszzl-lottery-5";
	}else if(rand >= 55 && rand<70){
		name = "mszzl-lottery-6";
	}else if(rand >= 40 && rand<55){
		name = "mszzl-lottery-7";
	}else if(rand >= 25 && rand<40){
		name = "mszzl-lottery-8";
	}else{
		name = "mszzl-lottery-9";
	}

	return name;
}

export default router;