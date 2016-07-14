webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(299);


/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _base = __webpack_require__(300);
	
	var _sevenMark = __webpack_require__(430);
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	$(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						window.base.seven = new _sevenMark.Seven();
	
					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	})));

/***/ },

/***/ 430:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Seven = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _baseClass = __webpack_require__(428);
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var path = "http://192.168.1.105:3000/gift/";
	
	var Seven = exports.Seven = function (_BaseClass) {
		_inherits(Seven, _BaseClass);
	
		function Seven() {
			_classCallCheck(this, Seven);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Seven).call(this));
	
			_this.initLine();
			_this.unionId = $('#u77-seven-mark').data('unionid');
			_this.initState();
			return _this;
		}
	
		_createClass(Seven, [{
			key: 'initState',
			value: function () {
				var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
					var result, count, i;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									result = false;
									_context.prev = 1;
									_context.next = 4;
									return $.get(path + 'daily-count', { unionId: this.unionId });
	
								case 4:
									result = _context.sent;
	
									console.log(result);
									_context.next = 13;
									break;
	
								case 8:
									_context.prev = 8;
									_context.t0 = _context['catch'](1);
	
									console.log(_context.t0);
									alert('获取礼包信息失败,请刷新重试.');
									return _context.abrupt('return', false);
	
								case 13:
									if (result) {
										_context.next = 16;
										break;
									}
	
									alert('获取礼包信息失败,请刷新重试.');
									return _context.abrupt('return', false);
	
								case 16:
									count = result.count;
	
									for (i = 1; i <= count; i++) {
										$('#u77-seven-mark .mark .seven .point-' + i).addClass('active');
									}
	
									$('#u77-seven-mark .mark .present').attr('src', 'http://file.u77.com/weixin/libao-0' + count + '.png');
	
								case 19:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, this, [[1, 8]]);
				}));
	
				function initState() {
					return _ref.apply(this, arguments);
				}
	
				return initState;
			}()
		}, {
			key: 'mark',
			value: function () {
				var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
					var result;
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									result = false;
									_context2.prev = 1;
	
									result = $.get(path + 'daily', { unionId: this.unionId });
									_context2.next = 10;
									break;
	
								case 5:
									_context2.prev = 5;
									_context2.t0 = _context2['catch'](1);
	
									console.log(_context2.t0);
									alert('获取礼包码失败,请刷新重试.');
									return _context2.abrupt('return', false);
	
								case 10:
									if (result) {
										_context2.next = 13;
										break;
									}
	
									alert('获取礼包码失败,请刷新重试.');
									return _context2.abrupt('return', false);
	
								case 13:
									console.log(result);
	
								case 14:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, this, [[1, 5]]);
				}));
	
				function mark() {
					return _ref2.apply(this, arguments);
				}
	
				return mark;
			}()
		}, {
			key: 'initLine',
			value: function initLine() {
				var wrap = $('#u77-seven-mark .mark .seven');
				for (var i = 1; i < 7; i++) {
					var pointOne = $('#u77-seven-mark .mark .seven .point-' + i);
					var pointTwo = $('#u77-seven-mark .mark .seven .point-' + (i + 1));
					this.drawLine(pointTwo, pointOne, wrap);
				}
			}
		}, {
			key: 'drawLine',
			value: function drawLine(a, b, wrap) {
				var lineC = Math.abs(b.position().left - a.position().left);
				var lineA = Math.abs(b.position().top - a.position().top);
				var lineB = Math.sqrt(lineA * lineA + lineC * lineC);
	
				var width = lineB;
	
				var _d = lineB * lineB + lineC * lineC - lineA * lineA;
				var _b = 2 * lineB * lineC;
				var angle = Math.acos(_d / _b);
				angle = angle / Math.PI * 180;
	
				var middleAx = a.position().left + a.outerWidth() / 2;
				var middleAy = a.position().top + a.outerHeight() / 2;
				var middleBx = b.position().left + b.outerWidth() / 2;
				var middleBy = b.position().top + b.outerHeight() / 2;
				var middlePx = void 0;
				var middlePy = void 0;
				var leftPoint = void 0;
				var rightPoint = void 0;
				if (middleAx < middleBx) {
					middlePx = middleAx + (middleBx - middleAx) / 2;
					leftPoint = a;
					rightPoint = b;
				} else {
					middlePx = middleBx + (middleAx - middleBx) / 2;
					leftPoint = b;
					rightPoint = a;
				}
	
				if (middleAy < middleBy) {
					middlePy = middleAy + (middleBy - middleAy) / 2;
				} else {
					middlePy = middleBy + (middleAy - middleBy) / 2;
				}
	
				if (leftPoint.position().top > rightPoint.position().top) {
					angle = -angle;
				}
	
				middlePx -= lineB / 2;
	
				var template = '<div class="line" style="left:{{x}}px;top:{{y}}px;width:{{width}}px;transform:rotate({{angle}}deg)"></div>';
	
				wrap.append($(template.replace(/{{x}}/g, middlePx).replace(/{{y}}/g, middlePy).replace(/{{width}}/g, lineB).replace(/{{angle}}/g, angle)));
			}
		}, {
			key: 'showMark',
			value: function () {
				var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(day) {
					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, this);
				}));

				function showMark(_x) {
					return _ref3.apply(this, arguments);
				}

				return showMark;
			}()
		}]);

		return Seven;
	}(_baseClass.BaseClass);

/***/ }

});
//# sourceMappingURL=seven-mark.js.map