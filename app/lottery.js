import {Router} from 'express';
import moment from "moment";
import crypto from 'crypto';

let router = Router();

router.get("/",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	if(user){
		console.log(user);
		lottery(user).then((result) => {
			res.send({result:result});
		},(error) => {
			res.send(error);
		});
	}else{
		res.send({
			status:101,
			err:"user required",
			msg:"用户为空"
		});
	}
});

router.get("/init",(req,res) => {
	let params = req.query;
	let user = params.unionId;
	if(user){
		console.log(user);
		lotteryInit(user).then((result) => {
			res.send({result:result});
		},(error) => {
			res.send(error);
		});
	}else{
		res.send({
			status:101,
			err:"user required",
			msg:"用户为空"
		});
	}
});

router.get("/test",(req,res) => {
	res.send("lottery");
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
				let rand = Math.random()*100;
				console.log(rand);
				return rand;
			}catch(e){
				console.log(e);
			}
		}else{
			return "bbb";
		}
	}else{
		return "aaa";
	}
}

export default router;