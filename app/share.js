import {Router} from 'express';
import moment from "moment";
import crypto from 'crypto';
import request from 'request-promise';

let router = Router();


router.get("/",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	let time = params.time;
	let from = params.from;

	if(!user){
		res.send({
			status:101,
			msg:"分享用户为空"
		});
		return;
	}

	if(!from){
		res.send({
			status:102,
			msg:"分享渠道为空"
		});
		return;
	}

	if(!time){
		res.send({
			status:103,
			msg:"访问时间为空"
		});
		return;
	}

	if(from != "friend" && from !="circle"){
		res.send({
			status:104,
			msg:"访问渠道错误"
		});
		return;
	}

	if(moment().unix() < time || moment().unix()-time > 3600 ){
		res.send({
			status:105,
			msg:"访问时间错误"
		});
		return;
	}

	share(user,from,time).then((result) => {
		res.send({result})
	})

});

router.get("/join",(req,res) => {
	let params = req.query;
	let shareUser = params.shareUnionId;
	let joinUser = params.joinUnionId;
	let time = params.time;

	if(!shareUser){
		res.send({
			status:101,
			msg:"分享用户为空"
		});
		return;
	}

	if(!joinUser){
		res.send({
			status:102,
			msg:"访问用户为空"
		});
		return;
	}

	if(!time){
		res.send({
			status:103,
			msg:"访问时间为空"
		});
		return;
	}

	if(joinUser == shareUser){
		res.send({
			status:104,
			msg:"访问用户为创建用户"
		});
		return;
	}

	if(moment().unix() < time || moment().unix()-time > 3600 ){
		res.send({
			status:105,
			msg:"访问时间错误"
		});
		return;
	}

	joinShare(shareUser,joinUser,time).then((result) => {
		res.send({result})
	})
});


async function share(user,from,time){
	let query = new AV.Query('Share');
	query.equalTo('user', user);
	let result = await query.first();
	let chanceFlag = true;
	if(result){
		let lastTime = result.get(from);
		if(moment.unix(time).format("YYYY-MM-DD") == moment.unix(lastTime).format("YYYY-MM-DD")){
			chanceFlag = false;
		}
	}else{
		let Share = global.Share;
		result = new Share();
		result.set("user",user);
	}

	result.set(from,time);
	let share = await result.save();

	let chance = "";
	if(chanceFlag){
		try{
			chance = await addChance(user);
		}catch(e){
			return {
				status:106,
				msg:"增加抽奖次数失败"
			}
		}
	}

	return {
		chance:chance,
		share:share
	};
}

async function joinShare(shareUser,joinUser,time){
	let query = new AV.Query('ShareLog');
	query.equalTo('shareUser', shareUser);
	query.equalTo('joinUser', joinUser);
	query.descending('createdAt');
	let log = await query.first();
	let chanceFlag = true;
	if(log){
		let lastTime = log.get("time");
		if(moment.unix(time).format("YYYY-MM-DD") == moment.unix(lastTime).format("YYYY-MM-DD")){
			chanceFlag = false;
		}
	}

	let chance = "";
	if(chanceFlag){
		try{
			chance = await addChance(shareUser);
		}catch(e){
			return {
				status:106,
				msg:"增加抽奖次数失败"
			}
		}
	}

	let shareLog = await addLog(shareUser,joinUser,time);

	return {
		chance:chance,
		shareLog:shareLog
	};
}

async function addLog(shareUser,joinUser,time){
	let ShareLog = global.ShareLog;

	let log = new ShareLog();
	log.set("shareUser",shareUser);
	log.set("joinUser",joinUser);
	log.set("time",time);

	return log.save();
}

async function addChance(user) {
	let query = new AV.Query('Lottery');
	query.equalTo('user', user);
	let lottery = await query.first();
	if(lottery){
		let num = lottery.get("num");
		lottery.set("num",num+1);
		return await lottery.save();
	}else{
		return {
			status:107,
			msg:"用户不存在"
		}
	}
}

export default router;