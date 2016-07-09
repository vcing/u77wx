import {Router} from 'express';
import weixin from './weixin.js';

let router = Router();

router.use('/weixin',weixin);

router.get('/test',(req,res,next) => {
	res.render('test/test.html',{test:'test'});
});

export default router;