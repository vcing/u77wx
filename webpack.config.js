var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var node_modules_dir = path.join(__dirname, 'node_modules');

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
	var jsPath = path.resolve(srcDir);
	var dirs = fs.readdirSync(jsPath);
	var matchs = [], files = {};
	dirs.forEach(function (item) {
		var _jsPath = path.resolve(process.cwd(), 'src/'+item);
		var _dirs = fs.readdirSync(_jsPath);
		_dirs.forEach(function (_item) {
			matchs = _item.match(/(.+)\.entry.js$/);
			if (matchs) {
				// es7 async 支持
				files[matchs[1]] = ['babel-polyfill',path.resolve(srcDir, item, _item)];
			}
		});
	});
	console.log(JSON.stringify(files));
	return files;
}

module.exports = {
	cache: true,
	devtool: "source-map",
	entry: getEntry(),
	output: {
		path: path.join(__dirname, "dest/js/"),
		publicPath: "dest/",
		filename: "[name].js",
		chunkFilename: "[chunkhash].js"
	},
	module:{
		loaders: [{
			test: /\.js$/,
			loaders: ['babel'],
			exclude: /node_modules/,
			include: __dirname + '/src'
		},{
			loader: "babel",

			// Skip any files outside of your project's `src` directory
			include: [
				path.resolve(__dirname, "src"),
			],

			// Only run `.js` and `.jsx` files through Babel
			test: /\.js?$/,

			// Options to configure babel with
			query: {
				presets: ['es2015', 'stage-3'],
			}
		}]
	},
	plugins: [
		new CommonsChunkPlugin('common.js'),
		// new uglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	]
};

// resolve: {
// 		alias: {
// 			// jquery: srcDir + "/js/lib/jquery.min.js",
// 			// core: srcDir + "/js/core",
// 			// ui: srcDir + "/js/ui"
// 		}
// 	},

		// new webpack.ProvidePlugin({
	//           $: 'jquery',
	//           jQuery: 'jquery',
	//           // AV:'./src/lib/realtime.js'
	//           // 'babel-polyfill':'babel-polyfill'
	//       }),


	// , {
	// 			test    : require.resolve('jquery'), 
	// 			loader: 'expose?jquery'
	// 		}, {
	// 			test    : path.resolve(node_modules_dir,'src/lib/realtime.js'),
	// 			loader: 'expose?realtime'
	// 		}


	// ,
	// 	externals:{
	// 		"$":"jquery",
	// 		"av":"realtime"
	// 	}