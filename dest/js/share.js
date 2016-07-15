webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(431);


/***/ },

/***/ 431:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(300);
	
	var _share = __webpack_require__(432);
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	$(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		var path;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						window.base.share = new _share.Share();
						path = window.path + "server-weixin/lead/share/" + $('#u77-unionid').val();
						_context.next = 4;
						return window.base.weixin.init();
	
					case 4:
						wx.onMenuShareTimeline({
							title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
							link: path, // 分享链接
							imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
							success: function success() {
								// 用户确认分享后执行的回调函数
								window.base.share.shareSuccess('circle');
							},
							cancel: function cancel() {
								// 用户取消分享后执行的回调函数
							}
						});
						wx.onMenuShareAppMessage({
							title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
							desc: '无脑策划又开始瞎TM送礼品了.', // 分享描述
							link: path, // 分享链接
							imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
							type: 'link', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function success() {
								// 用户确认分享后执行的回调函数
								window.base.share.shareSuccess('friend');
							},
							cancel: function cancel() {
								// 用户取消分享后执行的回调函数
							}
						});
	
						wx.onMenuShareQQ({
							title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
							desc: '无脑策划又开始瞎TM送礼品了.', // 分享描述
							link: path, // 分享链接
							imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
							success: function success() {
								// 用户确认分享后执行的回调函数
							},
							cancel: function cancel() {
								// 用户取消分享后执行的回调函数
							}
						});
	
						wx.onMenuShareQZone({
							title: '您的好友向您发起了一次爱抽抽,不抽随便的邀请.', // 分享标题
							desc: '无脑策划又开始瞎TM送礼品了.', // 分享描述
							link: path, // 分享链接
							imgUrl: 'http://file.u77.com/weixin/mslogo.png', // 分享图标
							success: function success() {
								// 用户确认分享后执行的回调函数
							},
							cancel: function cancel() {
								// 用户取消分享后执行的回调函数
							}
						});
	
					case 8:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	})));

/***/ },

/***/ 432:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Share = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _baseClass = __webpack_require__(428);
	
	var _moment = __webpack_require__(302);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var path = window.path;
	
	var Share = exports.Share = function (_BaseClass) {
		_inherits(Share, _BaseClass);
	
		function Share() {
			_classCallCheck(this, Share);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Share).call(this));
	
			_this.unionId = $('#u77-unionid').val();
			_this.state = $('#u77-state').val();
			_this.initState();
			_this.checkState();
			_this.paperOpen = false;
			return _this;
		}
	
		_createClass(Share, [{
			key: 'draw',
			value: function () {
				var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
					var result, award;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									if (!this.paperOpen) {
										_context.next = 4;
										break;
									}
	
									this.machineReset();
									this.paperOpen = false;
									return _context.abrupt('return');
	
								case 4:
									if (!(this.count <= 0)) {
										_context.next = 7;
										break;
									}
	
									alert('抽奖次数已经用完了,赶快分享获取更多抽奖机会吧.');
									return _context.abrupt('return');
	
								case 7:
									this.count--;
									$('#u77-share .lottery .machine .times').text(this.count);
									this.brokenAnimate();
									_context.next = 12;
									return $.get(path + 'lottery', { unionId: this.unionId });
	
								case 12:
									result = _context.sent;
									award = "";
	
									result.count = parseInt(result.count);
									_context.t0 = result.count;
									_context.next = _context.t0 === 1 ? 18 : _context.t0 === 2 ? 20 : _context.t0 === 3 ? 22 : _context.t0 === 4 ? 24 : _context.t0 === 5 ? 26 : _context.t0 === 6 ? 28 : _context.t0 === 7 ? 30 : _context.t0 === 8 ? 32 : _context.t0 === 9 ? 34 : 36;
									break;
	
								case 18:
									award = '<img src="http://file.u77.com/weixin/msicon/lb.png" width="50">*1';
									return _context.abrupt('break', 37);
	
								case 20:
									award = '<img src="http://file.u77.com/weixin/msicon/ctm.png" width="50">*1';
									return _context.abrupt('break', 37);
	
								case 22:
									award = '<img src="http://file.u77.com/weixin/msicon/szbf.png" width="50">*1';
									return _context.abrupt('break', 37);
	
								case 24:
									award = '<img src="http://file.u77.com/weixin/msicon/gjzml.png" width="50">*2';
									return _context.abrupt('break', 37);
	
								case 26:
									award = '<img src="http://file.u77.com/weixin/msicon/jys.png" width="50">*2';
									return _context.abrupt('break', 37);
	
								case 28:
									award = '<img src="http://file.u77.com/weixin/msicon/zml.png" width="50">*2';
									return _context.abrupt('break', 37);
	
								case 30:
									award = '<img src="http://file.u77.com/weixin/msicon/sxf.png" width="50">*5';
									return _context.abrupt('break', 37);
	
								case 32:
									award = '<img src="http://file.u77.com/weixin/msicon/jh.png" width="50">*50';
									return _context.abrupt('break', 37);
	
								case 34:
									award = '<img src="http://file.u77.com/weixin/msicon/xll.png" width="50">*5';
									return _context.abrupt('break', 37);
	
								case 36:
									return _context.abrupt('break', 37);
	
								case 37:
									$('#u77-share .lottery .machine .entry .paper .prize').html(award);
									$('#u77-share .lottery .machine .entry .paper .code').html(result.code);
									this.paperOpen = true;
									this.showPaper();
	
								case 41:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, this);
				}));
	
				function draw() {
					return _ref.apply(this, arguments);
				}
	
				return draw;
			}()
		}, {
			key: 'showPaper',
			value: function showPaper() {
				$('#u77-share .lottery .machine .entry .paper').animate({
					top: 0
				}, 3000);
			}
		}, {
			key: 'checkState',
			value: function checkState() {
				if (this.state != 'default') {
					$.get(path + 'share/join', {
						shareUnionId: this.state,
						joinUnionId: this.unionId,
						time: (0, _moment2.default)().unix()
					});
				}
			}
		}, {
			key: 'initState',
			value: function () {
				var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
					var count;
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									_context2.next = 2;
									return $.get(path + 'lottery/init', { unionId: this.unionId });
	
								case 2:
									count = _context2.sent;
	
									this.count = count;
									$('#u77-share .lottery .machine .times').text(count);
	
								case 5:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, this);
				}));
	
				function initState() {
					return _ref2.apply(this, arguments);
				}
	
				return initState;
			}()
		}, {
			key: 'brokenAnimate',
			value: function brokenAnimate() {
				this.ball = $('#u77-share .lottery .rocker .ball');
				this.hPole = $('#u77-share .lottery .rocker .h-pole');
				this.vPole = $('#u77-share .lottery .rocker .v-pole');
	
				this.ballBottom = this.ball.css('bottom');
				this.ballLeft = this.ball.css('left');
				this.hPoleBottom = this.hPole.css('bottom');
				this.hPoleLeft = this.hPole.css('left');
				this.vPoleBottom = this.vPole.css('bottom');
				this.vPoleLeft = this.vPole.css('left');
	
				this.fallAnimate(this.ball);
				this.fallAnimate(this.hPole);
				this.fallAnimate(this.vPole);
			}
		}, {
			key: 'fallAnimate',
			value: function fallAnimate(dom) {
				var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
				// dom.addClass('animate-rotate');
				this._fall(dom, height)();
			}
		}, {
			key: '_fall',
			value: function _fall(dom) {
				var _this2 = this;
	
				var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
				var ease = 'swing';
				return function () {
					if (height == 0) height = dom.css('bottom');
					height = parseInt(height);
					if (height < 10) return;
					height /= 2;
					var left = dom.css('left');
					left = parseInt(left);
					var angle = Math.random() * 50;
					var leftOffset = (0.5 - Math.random()) * 100;
	
					dom.animate({ bottom: 0, left: left - leftOffset / 2 + 'px', '-webkit-transform': 'rotate(' + angle + 'deg)' }, 300, ease, function () {
						dom.animate({ bottom: height + 'px', left: left - leftOffset / 2 + 'px', '-webkit-transform': 'rotate(' + angle + 'deg)' }, 300, ease, _this2._fall(dom, height));
					});
				};
			}
		}, {
			key: 'machineReset',
			value: function machineReset() {
				this.ball.animate({ left: this.ballLeft, bottom: this.ballBottom }, 300, 'swing');
				this.hPole.animate({ left: this.hPoleLeft, bottom: this.hPoleBottom }, 300, 'swing');
				this.vPole.animate({ left: this.vPoleLeft, bottom: this.vPoleBottom }, 300, 'swing');
				$('#u77-share .lottery .machine .entry .paper').animate({
					top: "-100%"
				}, 2000);
			}
		}, {
			key: 'shareSuccess',
			value: function shareSuccess(type) {
				var _this3 = this;
	
				$.get(path + 'share', {
					unionId: this.unionId,
					from: type,
					time: (0, _moment2.default)().unix()
				}, function (result) {
					if (result.status == 100) {
						_this3.count++;
						$('#u77-share .lottery .machine .times').text(_this3.count);
						return;
					} else if (result.status == 110) {} else {
						window.location.reload();
					}
				});
			}
		}]);

		return Share;
	}(_baseClass.BaseClass);

/***/ }

});
//# sourceMappingURL=share.js.map