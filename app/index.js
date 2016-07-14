import {Router} from 'express';
import weixin from './weixin.js';
import serverWeixin from './server-weixin.js';
import share from './share.js';
import lottery from './lottery.js';
import gift from './gift.js';
import user from './user.js';

let router = Router();

router.use('/server-weixin',serverWeixin);
router.use('/weixin',weixin);
router.use('/share',share);
router.use('/lottery',lottery);
router.use('/gift',gift);
router.use('/user',user);

router.get('/test',(req,res,next) => {
	res.render('test/test.html',{test:'test'});
});

export default router;