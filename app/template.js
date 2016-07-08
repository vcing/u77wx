import moment from 'moment';
moment.locale('zh-cn');

export default function templateHelper(app){
	// 静态目录
	app.locals['path'] = () => '/static/';
	// 另外一个静态目录
	app.locals['public'] = () => '/public/';
	app.locals['dump'] = data => dump(data);
	app.locals['s'] = text => {
		if(1){
			return text;
		}
	}
	app.locals['isInOneDay'] = time => time > moment().subtract(1,'days').unix();
	app.locals['time'] = time => moment.unix(time).format('YYYY-MM-DD HH:mm');
	app.locals['fromNow'] = time => moment.unix(time).fromNow();
}

// 输出测试
function dump(data,level=0) {
	let ignore = ['_locals','cache','settings'];
	let result = '';
	let space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	let hasContent = false;

	if(level == 0)result += '<div id="debug-code">';

	for(let key in data){

		let isSystem = false;
		for(let _key in ignore){
			if(key == ignore[_key])isSystem = true;
		}
		if(isSystem)continue;

		hasContent = true;
		if(typeof data[key] == "object" && data[key] != null){
			for(let i = 0 ; i < level; i++)result+=space;
			let content = dump(data[key],level+1);
			if(content.trim().length == 0) {
				result += '{}';
			}else {
				result += key+':{<br/>';
				result += content;
				for(let i = 0 ; i < level; i++)result+=space;
				result += '}<br/><br/>';	
			}
		}else{
			for(let i = 0 ; i < level; i++)result+=space;
			result += (key + ':' + data[key] + '<br/>');
		}
	}
	if(!hasContent)for(let i = 0 ; i < level; i++)result+=space;

	if(level == 0)result += '</div>';
	return result;
}