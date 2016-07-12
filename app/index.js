import {Router} from 'express';
import weixin from './weixin.js';
import serverWeixin from './server-weixin.js';

let router = Router();

router.use('/server-weixin',serverWeixin);
router.use('/weixin',weixin);

router.get('/test',(req,res,next) => {
	res.render('test/test.html',{test:'test'});
});

export default router;