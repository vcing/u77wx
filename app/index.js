import {Router} from 'express';

let router = Router();

router.get('/test',(req,res,next) => {
	res.render('test/test.html',{test:'test'});
});

export default router;