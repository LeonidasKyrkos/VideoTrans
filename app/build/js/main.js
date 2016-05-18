(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/video');

$('[data-js="video-trans"]').videoTransitions({
	endText: 'Ending text',
	transTime: 1.5,
	startImage: '/media/images/start.png'
});

},{"./modules/video":7}],2:[function(require,module,exports){
'use strict';

// fn called during video collection -> assigns relevant captions to passed video

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createCaptionsObject = function createCaptionsObject(scope, video) {
    video.$captions = video.$wrap.find('[data-js="caption"]');
    var captions = [];
    var caption = void 0;
    if (video.$captions !== null) {
        video.$captions.each(function (i, el) {
            var $el = $(el);
            captions[i] = {};
            captions[i].$element = $el;
            captions[i].start = $el.data('start');
            captions[i].end = $el.data('end');
            scope.setTransDuration($el);
        });
        return captions;
    } else {
        return null;
    }
};

exports.default = createCaptionsObject;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createCaptionsObject = require('./createCaptionsObject.js');

var _createCaptionsObject2 = _interopRequireDefault(_createCaptionsObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// collect all the videos and add event listeners for transitions. If captions are available, assign them
var createVideosObject = function createVideosObject(scope) {
    var videos = [];
    var video = void 0;

    scope.$videos.each(function (i, el) {
        var $el = $(el);
        videos[i] = video = {};

        video.$element = $el;
        video.$wrap = video.$element.parent();
        video.element = el;
        video.index = i;
        video.status = 'stopped';
        video.captions = (0, _createCaptionsObject2.default)(scope, video);
        video.$fallback = video.$wrap.find('[data-js="fallback"]');
        scope.setTransDuration(video.$fallback);
        video.error = false;

        scope.setTransDuration(video.$wrap);
        video.$wrap.addClass(scope.classDefault);

        // sort out transition type and fallback //
        var fn = scope.transitions.hasOwnProperty(scope.transitionType) ? scope.transitions[scope.transitionType].fn.bind(scope) : null;

        if (fn === null) {
            console.log('You have passed an unknown transition type ' + scope.transitionType + ' - reverting to default of fade');
            fn = scope.transitions['default'].fn.bind(scope);
        }

        fn(video);
    });

    return videos;
};

exports.default = createVideosObject;

},{"./createCaptionsObject.js":2}],4:[function(require,module,exports){
'use strict';

// create settings object using class' second parameter or defaults

Object.defineProperty(exports, "__esModule", {
    value: true
});
var videoSettings = function videoSettings(settings, $container) {
    var x = {
        transitionType: 'default',
        looping: true,
        transTime: 3,
        loopText: false,
        startImage: false,
        endText: false,
        endImage: false,
        restarted: false,
        muted: true,
        customTransitions: {}
    };

    $.extend(x, settings);

    !x.startImage ? false : $container.prepend('<div data-js="startpoint" class="video-trans__startpoint--img" style="background-image: url(\'' + x.startImage + '\')"><!--[a]--></div>');

    // if end image or text then add markup and then add it to the settings.end property
    !x.endImage ? false : $container.prepend('<div data-js="endpoint" class="video-trans__endpoint--img inactive"><!--[a]--></div>');
    !x.endText ? false : $container.prepend('<h1 data-js="endpoint" class="video-trans__endpoint--text inactive">' + x.endText + '</h1>');

    x.start = $('[data-js="startpoint"]');
    x.end = $('[data-js="endpoint"]');

    return x;
};

exports.default = videoSettings;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var videoTests = function videoTests() {
	var def = new $.Deferred();
	def.promise();

	// run tests for Modernizr and videoautoplay	
	if (typeof Modernizr !== 'undefined') {
		(function () {
			// manual timeout fallback. If we can't play the first video within 3 seconds then fallback to carousel //
			var timer = setTimeout(function () {
				def.resolve(false);
			}, 3000);
			if (Modernizr.videoautoplay) {
				clearTimeout(timer);
				def.resolve(true);
			} else if (!Modernizr.videoautoplay && typeof Modernizr.videoautoplay !== 'undefined') {
				def.resolve(false);
			}
			Modernizr.on('videoautoplay', function (result) {
				Modernizr.videoautoplay = result;
				clearTimeout(timer);
				if (result) {
					def.resolve(true);
				} else {
					def.resolve(false);
				}
			});
		})();
	} else {
		def.resolve(true);
	}

	return def;
};

exports.default = videoTests;

},{}],6:[function(require,module,exports){
'use strict';

// define out transition/animation classes. Include custom ones passed in during intialisation

Object.defineProperty(exports, "__esModule", {
    value: true
});
var videoTransitions = function videoTransitions(scope) {
    var obj = {
        default: {
            fn: scope.events,
            classPlaying: 'playing',
            classOut: 'fadeOut',
            classDefault: 'fader',
            property: 'opacity',
            easing: 'linear'
        },
        none: {
            fn: scope.noTransition,
            classPlaying: '',
            classOut: '',
            classDefault: '',
            property: '',
            easing: ''
        },
        spin: {
            fn: scope.events,
            classPlaying: 'playing',
            classOut: 'spinOut',
            classDefault: 'spinner',
            property: 'all',
            easing: 'ease-out'
        }
    };

    // loop through custom transitions provided by user and add them to our transitions object.
    $.extend(obj, scope.settings.customTransitions);
    if (scope.settings.customTransitions) {
        for (var transition in scope.settings.customTransitions) {
            var clone = $.extend({}, obj.default);
            obj[transition] = $.extend(clone, obj[transition]);
        }
    }

    return obj;
};

exports.default = videoTransitions;

},{}],7:[function(require,module,exports){
/*
	Video transitioning jquery plugin v0.15 [parity with 0.65 of default version] written by L Kyrkos (c) Redsnapper 2016
	Plugin aims to provide a system for implementing transitioning videos interlinked with timed text effects
	Can be used with single video if only captions are required or multiple videos if video transitions are required
	leo@redsnapper.net for questions
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _settings = require('./submodules/settings.js');

var _settings2 = _interopRequireDefault(_settings);

var _transitions = require('./submodules/transitions.js');

var _transitions2 = _interopRequireDefault(_transitions);

var _tests = require('./submodules/tests.js');

var _tests2 = _interopRequireDefault(_tests);

var _createVideosObject = require('./submodules/createVideosObject.js');

var _createVideosObject2 = _interopRequireDefault(_createVideosObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pluginName = 'videoTransitions';

var Plugin = function () {
	function Plugin(el, settings) {
		var _this = this;

		_classCallCheck(this, Plugin);

		this.container = el;
		this.$container = $(this.container);
		this.settings = (0, _settings2.default)(settings, this.$container);
		this.transitionType = this.settings.transitionType;
		this.transitions = (0, _transitions2.default)(this);
		this.initTransClasses();
		this.looping = this.settings.looping;
		this.$videos = this.$container.find('video');
		this.$captions = this.$container.find('[data-js="caption"]');
		this.videos = (0, _createVideosObject2.default)(this);

		$.when(_tests2.default).done(function (bool) {
			bool ? _this.passed() : _this.failed();
		});
	}

	// define transition classes [from this.transitions object]


	_createClass(Plugin, [{
		key: 'initTransClasses',
		value: function initTransClasses() {
			if (this.transitions.hasOwnProperty(this.transitionType)) {
				this.classPlaying = this.transitions[this.transitionType].classPlaying;
				this.classOut = this.transitions[this.transitionType].classOut;
				this.classDefault = this.transitions[this.transitionType].classDefault;
			} else {
				this.classPlaying = '';
				this.classOut = '';
				this.classDefault = '';
			}
		}
	}, {
		key: 'passed',
		value: function passed() {
			var _this2 = this;

			// if the first video has loaded -> go //
			if (this.videos[0].element.readyState >= 4) {
				this.init();
			} else {
				// when the first video can play -> go //
				this.videos[0].$element.one('canplay', function () {
					_this2.init();
				});
			}
		}
	}, {
		key: 'failed',
		value: function failed() {
			this.fallbackToCarousel();
		}
	}, {
		key: 'init',
		value: function init() {
			// hide start element
			this.settings.start.addClass('inactive');

			// apply the mute status to the videos
			for (var i = 0; i < Object.keys(this.videos).length; i++) {
				this.videos[i].element.muted = this.settings.muted;
			}

			// play the first video
			this.playVideo(this.videos[0]);
		}

		// if we've been given transition durations then set them on the element (overrides the CSS)

	}, {
		key: 'setTransDuration',
		value: function setTransDuration($el) {
			$el[0].style.WebkitTransition = this.transitions[this.transitionType].property + ' ' + this.settings.transTime + 's ' + this.transitions[this.transitionType].easing;
			$el[0].style.MozTransition = this.transitions[this.transitionType].property + ' ' + this.settings.transTime + 's ' + this.transitions[this.transitionType].easing;
		}
	}, {
		key: 'events',
		value: function events(videoObj) {
			var video = videoObj.element;
			var $video = videoObj.$element;

			$video.on('timeupdate', $.proxy(this.timing, this, videoObj));
			$video.on('ended', $.proxy(this.endTransition, this, videoObj));
			$video.on('error', $.proxy(this.videoError, this, videoObj));
		}

		//// NOTRANSITION ////

	}, {
		key: 'noTransition',
		value: function noTransition() {
			console.log('no transitions being applied to videos');
		}
		//// NOTRANSITION end /////////////////////////

		// fn called when each video ends

	}, {
		key: 'endTransition',
		value: function endTransition(videoObj) {
			videoObj.status = 'stopped';
			videoObj.$wrap.removeClass(this.classPlaying + ' ' + this.classOut);

			// if last video in collection: call this.ended which will either restart or end the process
			this.last(videoObj) ? this.ended() : false;
		}

		// fn called when each video ends. hides captions if they haven't already been hidden based on timing

	}, {
		key: 'hideCaptions',
		value: function hideCaptions($captions) {
			$captions.each(function (i, el) {
				$(el).addClass('inactive');
			});
		}

		// fn called whenever timeupdate event is fired by playing videos. used to calculate transition timings

	}, {
		key: 'timing',
		value: function timing(videoObj) {
			var video = videoObj.element;

			// if currTime is the set transition time from the end of the video and the video isn't already transitioning then transition the video.
			video.currentTime > video.duration - this.settings.transTime && videoObj.status != 'transitioning' ? this.startTransition(videoObj) : false;

			// if we're not in the first play through and we're not looping the text do nothing
			if (this.settings.restarted & !this.settings.looptext) {
				false;
			} else if (videoObj.captions !== null) {
				// otherwise if we have captions, transition them
				for (var i = 0; i <= videoObj.captions.length - 1; i++) {
					var start = videoObj.captions[i].start;
					var end = videoObj.captions[i].end;
					var $el = videoObj.captions[i].$element;

					if (start <= video.currentTime && end >= video.currentTime) {
						$el.removeClass('inactive');
					}

					if (end <= video.currentTime & !$el.hasClass('inactive')) {
						$el.addClass('inactive');
					}
				}
			}
		}
	}, {
		key: 'videoError',
		value: function videoError(videoObj) {
			videoObj.error = true;
		}

		// start the transition of the video

	}, {
		key: 'startTransition',
		value: function startTransition(videoObj) {
			videoObj.status = 'transitioning';
			var nextVideoObj = this.nextVideo(videoObj);

			videoObj.$wrap.addClass(this.classOut);

			// if not last, play the next video ELSE call our ending function
			if (!this.last(videoObj)) {
				this.playVideo(nextVideoObj);
			} else {
				this.ending();
			}
		}

		// check if the videoObject passed is the last item in the collection

	}, {
		key: 'last',
		value: function last(videoObj) {
			if (videoObj.index === this.videos.length - 1) {
				return true;
			} else {
				return false;
			}
		}

		// find the next video in the collection

	}, {
		key: 'nextVideo',
		value: function nextVideo(videoObj) {
			return this.videos[videoObj.index + 1];
		}

		// play the video, add the appropriate classes and set the object's status

	}, {
		key: 'playVideo',
		value: function playVideo(videoObj) {
			videoObj.element.play();
			videoObj.status = 'playing';
			videoObj.$wrap.addClass(videoObj.status);
		}

		// restart the sequence

	}, {
		key: 'restart',
		value: function restart() {
			if (this.looping) {
				this.settings.restarted = true;
				this.init();
			} else {
				false;
			}
		}

		// last video is transitioning out - bring in the endpoint stuff.

	}, {
		key: 'ending',
		value: function ending() {
			this.settings.end ? this.settings.end.removeClass('inactive') : false;
		}

		// last video has ended, restart or allow to end.

	}, {
		key: 'ended',
		value: function ended() {
			this.settings.looping ? this.restart() : false;
		}

		// destroy videoTrans

	}, {
		key: 'destroy',
		value: function destroy() {
			for (var i = 0; i < Object.keys(this.videos).length; i++) {
				this.videos[i].element.pause();
				this.videos[i].element.currentTime = 0;
				this.videos[i].$wrap.removeClass(this.transitions[this.transitionType].classPlaying);
				delete this.videos[i];
			}
			delete this.videos;
		}

		// fallback for those no autoplay devices and IE8.

	}, {
		key: 'fallbackToCarousel',
		value: function fallbackToCarousel() {
			if (Modernizr.video) {
				this.initCarousel();
			} else {
				this.ohGodItsOldIeRunForTheHills();
			}
		}

		// initialise carousel and set up markup

	}, {
		key: 'initCarousel',
		value: function initCarousel() {
			var _this3 = this;

			this.createFallbackMarkup();
			this.$fallbacksWrap = this.$container.find('[data-js="fallbackWrap"]');
			this.$fallbacks = this.$fallbacksWrap.find('[data-js="fallback"]');
			this.$firstFallback = this.$fallbacks.eq(0);

			setTimeout(function () {
				_this3.rotateCarousel(_this3.$firstFallback);
			}, this.$firstFallback.data('duration') * 1000);
		}

		// create markup required for carousel

	}, {
		key: 'createFallbackMarkup',
		value: function createFallbackMarkup() {
			this.fallbacks = [];
			for (var i = 0; i < Object.keys(this.videos).length; i++) {
				this.fallbacks[this.videos[i].index] = this.videos[i].$fallback;
			}

			this.$container.append('<div class="video-trans__fallback-wrap" data-js="fallbackWrap"></div>');
			this.$fallbackWrap = $('[data-js="fallbackWrap"]');

			for (var i = 0; i < Object.keys(this.fallbacks).length; i++) {
				this.$fallbackWrap.append(this.fallbacks[i][0].outerHTML);
			}
		}

		// rotate the carousel by 1 image

	}, {
		key: 'rotateCarousel',
		value: function rotateCarousel(next) {
			var _this4 = this;

			var $current = this.$fallbacksWrap.find('.playing');
			var $next = next;

			if ($current.index() === this.$fallbacks.length - 1) {
				$next = this.$firstFallback;
			} else {
				$next = $current.next();
			}

			$current.removeClass('playing');
			$next.addClass('playing');

			setTimeout(function ($next) {
				_this4.rotateCarousel($next);
			}, $next.data('duration') * 1000);
		}
	}, {
		key: 'ohGodItsOldIeRunForTheHills',
		value: function ohGodItsOldIeRunForTheHills() {
			console.log('The dark times have come again.');
		}
	}]);

	return Plugin;
}();

$.fn[pluginName] = function (options) {
	return this.each(function () {
		if (!$.data(this, "plugin_" + pluginName)) {
			return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
		}
	});
};

},{"./submodules/createVideosObject.js":3,"./submodules/settings.js":4,"./submodules/tests.js":5,"./submodules/transitions.js":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2pzL21haW4uanMiLCJhcHAvc3JjL2pzL21vZHVsZXMvc3VibW9kdWxlcy9jcmVhdGVDYXB0aW9uc09iamVjdC5qcyIsImFwcC9zcmMvanMvbW9kdWxlcy9zdWJtb2R1bGVzL2NyZWF0ZVZpZGVvc09iamVjdC5qcyIsImFwcC9zcmMvanMvbW9kdWxlcy9zdWJtb2R1bGVzL3NldHRpbmdzLmpzIiwiYXBwL3NyYy9qcy9tb2R1bGVzL3N1Ym1vZHVsZXMvdGVzdHMuanMiLCJhcHAvc3JjL2pzL21vZHVsZXMvc3VibW9kdWxlcy90cmFuc2l0aW9ucy5qcyIsImFwcC9zcmMvanMvbW9kdWxlcy92aWRlby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOztBQUVBLEVBQUUseUJBQUYsRUFBNkIsZ0JBQTdCLENBQThDO0FBQzdDLFVBQVMsYUFEb0M7QUFFN0MsWUFBVyxHQUZrQztBQUc3QyxhQUFZO0FBSGlDLENBQTlDOzs7QUNKQTs7Ozs7OztBQUlBLElBQUksdUJBQXVCLFNBQXZCLG9CQUF1QixDQUFTLEtBQVQsRUFBZSxLQUFmLEVBQXNCO0FBQzdDLFVBQU0sU0FBTixHQUFrQixNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQWlCLHFCQUFqQixDQUFsQjtBQUNBLFFBQUksV0FBVyxFQUFmO0FBQ0EsUUFBSSxnQkFBSjtBQUNBLFFBQUcsTUFBTSxTQUFOLEtBQW9CLElBQXZCLEVBQTZCO0FBQ3pCLGNBQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFDLENBQUQsRUFBSSxFQUFKLEVBQVc7QUFDNUIsZ0JBQUksTUFBTSxFQUFFLEVBQUYsQ0FBVjtBQUNBLHFCQUFTLENBQVQsSUFBYyxFQUFkO0FBQ0EscUJBQVMsQ0FBVCxFQUFZLFFBQVosR0FBdUIsR0FBdkI7QUFDQSxxQkFBUyxDQUFULEVBQVksS0FBWixH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RUEsY0FBVyxVQUFDLEtBQUQsRUFBUztBQUFFLFdBQUssY0FBTCxDQUFvQixLQUFwQjtBQUE0QixJQUFsRCxFQUFtRCxNQUFNLElBQU4sQ0FBVyxVQUFYLElBQXlCLElBQTVFO0FBQ0E7OztnREFFNkI7QUFDN0IsV0FBUSxHQUFSLENBQVksaUNBQVo7QUFDQTs7Ozs7O0FBR0YsRUFBRSxFQUFGLENBQUssVUFBTCxJQUFtQixVQUFVLE9BQVYsRUFBbUI7QUFDckMsUUFBTyxLQUFLLElBQUwsQ0FBVSxZQUFZO0FBQzVCLE1BQUksQ0FBQyxFQUFFLElBQUYsQ0FBTyxJQUFQLEVBQWEsWUFBWSxVQUF6QixDQUFMLEVBQTJDO0FBQzFDLFVBQU8sRUFBRSxJQUFGLENBQU8sSUFBUCxFQUFhLFlBQVksVUFBekIsRUFBcUMsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFpQixPQUFqQixDQUFyQyxDQUFQO0FBQ0E7QUFDRCxFQUpNLENBQVA7QUFLQSxDQU5EIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICcuL21vZHVsZXMvdmlkZW8nO1xuXG4kKCdbZGF0YS1qcz1cInZpZGVvLXRyYW5zXCJdJykudmlkZW9UcmFuc2l0aW9ucyh7XG5cdGVuZFRleHQ6ICdFbmRpbmcgdGV4dCcsXG5cdHRyYW5zVGltZTogMS41LFxuXHRzdGFydEltYWdlOiAnL21lZGlhL2ltYWdlcy9zdGFydC5wbmcnXG59KTsiLCIndXNlIHN0cmljdCdcblxuXG4vLyBmbiBjYWxsZWQgZHVyaW5nIHZpZGVvIGNvbGxlY3Rpb24gLT4gYXNzaWducyByZWxldmFudCBjYXB0aW9ucyB0byBwYXNzZWQgdmlkZW9cbmxldCBjcmVhdGVDYXB0aW9uc09iamVjdCA9IGZ1bmN0aW9uKHNjb3BlLHZpZGVvKSB7XG4gICAgdmlkZW8uJGNhcHRpb25zID0gdmlkZW8uJHdyYXAuZmluZCgnW2RhdGEtanM9XCJjYXB0aW9uXCJdJyk7XG4gICAgbGV0IGNhcHRpb25zID0gW107XG4gICAgbGV0IGNhcHRpb247XG4gICAgaWYodmlkZW8uJGNhcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgIHZpZGVvLiRjYXB0aW9ucy5lYWNoKChpLCBlbCkgPT4ge1xuICAgICAgICAgICAgbGV0ICRlbCA9ICQoZWwpO1xuICAgICAgICAgICAgY2FwdGlvbnNbaV0gPSB7fTtcbiAgICAgICAgICAgIGNhcHRpb25zW2ldLiRlbGVtZW50ID0gJGVsO1xuICAgICAgICAgICAgY2FwdGlvbnNbaV0uc3RhcnQgPSAkZWwuZGF0YSgnc3RhcnQnKTtcbiAgICAgICAgICAgIGNhcHRpb25zW2ldLmVuZCA9ICRlbC5kYXRhKCdlbmQnKTtcbiAgICAgICAgICAgIHNjb3BlLnNldFRyYW5zRHVyYXRpb24oJGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjYXB0aW9ucztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNhcHRpb25zT2JqZWN0OyIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgY3JlYXRlQ2FwdGlvbnNPYmplY3QgZnJvbSAnLi9jcmVhdGVDYXB0aW9uc09iamVjdC5qcyc7XG5cblxuLy8gY29sbGVjdCBhbGwgdGhlIHZpZGVvcyBhbmQgYWRkIGV2ZW50IGxpc3RlbmVycyBmb3IgdHJhbnNpdGlvbnMuIElmIGNhcHRpb25zIGFyZSBhdmFpbGFibGUsIGFzc2lnbiB0aGVtXG5sZXQgY3JlYXRlVmlkZW9zT2JqZWN0ID0gZnVuY3Rpb24oc2NvcGUpIHtcbiAgICBsZXQgdmlkZW9zID0gW107XG4gICAgbGV0IHZpZGVvO1xuXG4gICAgc2NvcGUuJHZpZGVvcy5lYWNoKChpLCBlbCkgPT4ge1xuICAgICAgICBsZXQgJGVsID0gJChlbCk7XG4gICAgICAgIHZpZGVvc1tpXSA9IHZpZGVvID0ge307XG5cbiAgICAgICAgdmlkZW8uJGVsZW1lbnQgPSAkZWw7XG4gICAgICAgIHZpZGVvLiR3cmFwID0gdmlkZW8uJGVsZW1lbnQucGFyZW50KCk7XG4gICAgICAgIHZpZGVvLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgdmlkZW8uaW5kZXggPSBpO1xuICAgICAgICB2aWRlby5zdGF0dXMgPSAnc3RvcHBlZCc7XG4gICAgICAgIHZpZGVvLmNhcHRpb25zID0gY3JlYXRlQ2FwdGlvbnNPYmplY3Qoc2NvcGUsdmlkZW8pO1xuICAgICAgICB2aWRlby4kZmFsbGJhY2sgPSB2aWRlby4kd3JhcC5maW5kKCdbZGF0YS1qcz1cImZhbGxiYWNrXCJdJyk7XHRcdFx0XG4gICAgICAgIHNjb3BlLnNldFRyYW5zRHVyYXRpb24odmlkZW8uJGZhbGxiYWNrKTtcbiAgICAgICAgdmlkZW8uZXJyb3IgPSBmYWxzZTtcblxuICAgICAgICBzY29wZS5zZXRUcmFuc0R1cmF0aW9uKHZpZGVvLiR3cmFwKTtcbiAgICAgICAgdmlkZW8uJHdyYXAuYWRkQ2xhc3Moc2NvcGUuY2xhc3NEZWZhdWx0KTtcblxuICAgICAgICAvLyBzb3J0IG91dCB0cmFuc2l0aW9uIHR5cGUgYW5kIGZhbGxiYWNrIC8vXG4gICAgICAgIGxldCBmbiA9IHNjb3BlLnRyYW5zaXRpb25zLmhhc093blByb3BlcnR5KHNjb3BlLnRyYW5zaXRpb25UeXBlKSA/IHNjb3BlLnRyYW5zaXRpb25zW3Njb3BlLnRyYW5zaXRpb25UeXBlXS5mbi5iaW5kKHNjb3BlKSA6IG51bGw7XG5cbiAgICAgICAgaWYoZm4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBZb3UgaGF2ZSBwYXNzZWQgYW4gdW5rbm93biB0cmFuc2l0aW9uIHR5cGUgJHtzY29wZS50cmFuc2l0aW9uVHlwZX0gLSByZXZlcnRpbmcgdG8gZGVmYXVsdCBvZiBmYWRlYCk7XG4gICAgICAgICAgICBmbiA9IHNjb3BlLnRyYW5zaXRpb25zWydkZWZhdWx0J10uZm4uYmluZChzY29wZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmbih2aWRlbyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmlkZW9zO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVWaWRlb3NPYmplY3Q7IiwiJ3VzZSBzdHJpY3QnXG5cblxuLy8gY3JlYXRlIHNldHRpbmdzIG9iamVjdCB1c2luZyBjbGFzcycgc2Vjb25kIHBhcmFtZXRlciBvciBkZWZhdWx0c1xubGV0IHZpZGVvU2V0dGluZ3MgPSBmdW5jdGlvbihzZXR0aW5ncywkY29udGFpbmVyKSB7XG4gICAgbGV0IHggPSB7XG4gICAgICAgIHRyYW5zaXRpb25UeXBlOiAnZGVmYXVsdCcsXG4gICAgICAgIGxvb3Bpbmc6IHRydWUsXG4gICAgICAgIHRyYW5zVGltZTogMyxcbiAgICAgICAgbG9vcFRleHQ6IGZhbHNlLFxuICAgICAgICBzdGFydEltYWdlOiBmYWxzZSxcbiAgICAgICAgZW5kVGV4dDogZmFsc2UsXG4gICAgICAgIGVuZEltYWdlOiBmYWxzZSxcbiAgICAgICAgcmVzdGFydGVkOiBmYWxzZSxcbiAgICAgICAgbXV0ZWQ6IHRydWUsXG4gICAgICAgIGN1c3RvbVRyYW5zaXRpb25zOiB7fVxuICAgIH1cbiAgICBcbiAgICAkLmV4dGVuZCh4LHNldHRpbmdzKTtcbiAgICBcbiAgICBcbiAgICAheC5zdGFydEltYWdlID8gZmFsc2UgOiAkY29udGFpbmVyLnByZXBlbmQoYDxkaXYgZGF0YS1qcz1cInN0YXJ0cG9pbnRcIiBjbGFzcz1cInZpZGVvLXRyYW5zX19zdGFydHBvaW50LS1pbWdcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJHt4LnN0YXJ0SW1hZ2V9JylcIj48IS0tW2FdLS0+PC9kaXY+YCk7XG5cbiAgICAvLyBpZiBlbmQgaW1hZ2Ugb3IgdGV4dCB0aGVuIGFkZCBtYXJrdXAgYW5kIHRoZW4gYWRkIGl0IHRvIHRoZSBzZXR0aW5ncy5lbmQgcHJvcGVydHlcbiAgICAheC5lbmRJbWFnZSA/IGZhbHNlIDogJGNvbnRhaW5lci5wcmVwZW5kKGA8ZGl2IGRhdGEtanM9XCJlbmRwb2ludFwiIGNsYXNzPVwidmlkZW8tdHJhbnNfX2VuZHBvaW50LS1pbWcgaW5hY3RpdmVcIj48IS0tW2FdLS0+PC9kaXY+YCk7XG4gICAgIXguZW5kVGV4dCA/IGZhbHNlIDogJGNvbnRhaW5lci5wcmVwZW5kKGA8aDEgZGF0YS1qcz1cImVuZHBvaW50XCIgY2xhc3M9XCJ2aWRlby10cmFuc19fZW5kcG9pbnQtLXRleHQgaW5hY3RpdmVcIj4ke3guZW5kVGV4dH08L2gxPmApO1xuXG4gICAgeC5zdGFydCA9ICQoJ1tkYXRhLWpzPVwic3RhcnRwb2ludFwiXScpO1xuICAgIHguZW5kID0gJCgnW2RhdGEtanM9XCJlbmRwb2ludFwiXScpO1xuXG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZpZGVvU2V0dGluZ3M7IiwiJ3VzZSBzdHJpY3QnXG5cblxubGV0IHZpZGVvVGVzdHMgPSBmdW5jdGlvbigpe1xuXHRsZXQgZGVmID0gbmV3ICQuRGVmZXJyZWQoKTtcblx0ZGVmLnByb21pc2UoKTtcblx0XG5cdC8vIHJ1biB0ZXN0cyBmb3IgTW9kZXJuaXpyIGFuZCB2aWRlb2F1dG9wbGF5XHRcblx0aWYodHlwZW9mIE1vZGVybml6ciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyBtYW51YWwgdGltZW91dCBmYWxsYmFjay4gSWYgd2UgY2FuJ3QgcGxheSB0aGUgZmlyc3QgdmlkZW8gd2l0aGluIDMgc2Vjb25kcyB0aGVuIGZhbGxiYWNrIHRvIGNhcm91c2VsIC8vXG5cdFx0bGV0IHRpbWVyID0gc2V0VGltZW91dCgoKT0+eyBkZWYucmVzb2x2ZShmYWxzZSk7IH0sMzAwMCk7XG5cdFx0aWYoTW9kZXJuaXpyLnZpZGVvYXV0b3BsYXkpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRkZWYucmVzb2x2ZSh0cnVlKTtcblx0XHR9IGVsc2UgaWYoIU1vZGVybml6ci52aWRlb2F1dG9wbGF5ICYmIHR5cGVvZiBNb2Rlcm5penIudmlkZW9hdXRvcGxheSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGRlZi5yZXNvbHZlKGZhbHNlKTtcblx0XHR9XG5cdFx0TW9kZXJuaXpyLm9uKCd2aWRlb2F1dG9wbGF5JywocmVzdWx0KSA9PiB7XG5cdFx0XHRNb2Rlcm5penIudmlkZW9hdXRvcGxheSA9IHJlc3VsdDtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdGRlZi5yZXNvbHZlKHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcdFx0XHRcdFx0XG5cdFx0XHRcdGRlZi5yZXNvbHZlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRkZWYucmVzb2x2ZSh0cnVlKTtcblx0fVxuXHRcblx0cmV0dXJuIGRlZjtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCB2aWRlb1Rlc3RzOyIsIid1c2Ugc3RyaWN0J1xuXG5cbi8vIGRlZmluZSBvdXQgdHJhbnNpdGlvbi9hbmltYXRpb24gY2xhc3Nlcy4gSW5jbHVkZSBjdXN0b20gb25lcyBwYXNzZWQgaW4gZHVyaW5nIGludGlhbGlzYXRpb25cbmxldCB2aWRlb1RyYW5zaXRpb25zID0gZnVuY3Rpb24oc2NvcGUpIHtcbiAgICBsZXQgb2JqID0ge1xuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBmbjogc2NvcGUuZXZlbnRzLFxuICAgICAgICAgICAgY2xhc3NQbGF5aW5nOiAncGxheWluZycsXG4gICAgICAgICAgICBjbGFzc091dDogJ2ZhZGVPdXQnLFxuICAgICAgICAgICAgY2xhc3NEZWZhdWx0OiAnZmFkZXInLFxuICAgICAgICAgICAgcHJvcGVydHk6ICdvcGFjaXR5JyxcbiAgICAgICAgICAgIGVhc2luZzogJ2xpbmVhcidcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZToge1xuICAgICAgICAgICAgZm46IHNjb3BlLm5vVHJhbnNpdGlvbixcbiAgICAgICAgICAgIGNsYXNzUGxheWluZzogJycsXG4gICAgICAgICAgICBjbGFzc091dDogJycsXG4gICAgICAgICAgICBjbGFzc0RlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgcHJvcGVydHk6ICcnLFxuICAgICAgICAgICAgZWFzaW5nOiAnJ1xuICAgICAgICB9LFxuICAgICAgICBzcGluOiB7XG4gICAgICAgICAgICBmbjogc2NvcGUuZXZlbnRzLFxuICAgICAgICAgICAgY2xhc3NQbGF5aW5nOiAncGxheWluZycsXG4gICAgICAgICAgICBjbGFzc091dDogJ3NwaW5PdXQnLFxuICAgICAgICAgICAgY2xhc3NEZWZhdWx0OiAnc3Bpbm5lcicsXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2FsbCcsXG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlLW91dCdcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBsb29wIHRocm91Z2ggY3VzdG9tIHRyYW5zaXRpb25zIHByb3ZpZGVkIGJ5IHVzZXIgYW5kIGFkZCB0aGVtIHRvIG91ciB0cmFuc2l0aW9ucyBvYmplY3QuXG4gICAgJC5leHRlbmQob2JqLHNjb3BlLnNldHRpbmdzLmN1c3RvbVRyYW5zaXRpb25zKTtcbiAgICBpZihzY29wZS5zZXR0aW5ncy5jdXN0b21UcmFuc2l0aW9ucykge1xuICAgICAgICBmb3IobGV0IHRyYW5zaXRpb24gaW4gc2NvcGUuc2V0dGluZ3MuY3VzdG9tVHJhbnNpdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9ICQuZXh0ZW5kKHt9LG9iai5kZWZhdWx0KTtcbiAgICAgICAgICAgIG9ialt0cmFuc2l0aW9uXSA9ICQuZXh0ZW5kKGNsb25lLG9ialt0cmFuc2l0aW9uXSk7IFxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBvYmo7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZpZGVvVHJhbnNpdGlvbnM7IiwiLypcblx0VmlkZW8gdHJhbnNpdGlvbmluZyBqcXVlcnkgcGx1Z2luIHYwLjE1IFtwYXJpdHkgd2l0aCAwLjY1IG9mIGRlZmF1bHQgdmVyc2lvbl0gd3JpdHRlbiBieSBMIEt5cmtvcyAoYykgUmVkc25hcHBlciAyMDE2XG5cdFBsdWdpbiBhaW1zIHRvIHByb3ZpZGUgYSBzeXN0ZW0gZm9yIGltcGxlbWVudGluZyB0cmFuc2l0aW9uaW5nIHZpZGVvcyBpbnRlcmxpbmtlZCB3aXRoIHRpbWVkIHRleHQgZWZmZWN0c1xuXHRDYW4gYmUgdXNlZCB3aXRoIHNpbmdsZSB2aWRlbyBpZiBvbmx5IGNhcHRpb25zIGFyZSByZXF1aXJlZCBvciBtdWx0aXBsZSB2aWRlb3MgaWYgdmlkZW8gdHJhbnNpdGlvbnMgYXJlIHJlcXVpcmVkXG5cdGxlb0ByZWRzbmFwcGVyLm5ldCBmb3IgcXVlc3Rpb25zXG4qL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB2aWRlb1NldHRpbmdzIGZyb20gJy4vc3VibW9kdWxlcy9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgdmlkZW9UcmFuc2l0aW9ucyBmcm9tICcuL3N1Ym1vZHVsZXMvdHJhbnNpdGlvbnMuanMnO1xuaW1wb3J0IHZpZGVvVGVzdHMgZnJvbSAnLi9zdWJtb2R1bGVzL3Rlc3RzLmpzJztcbmltcG9ydCBjcmVhdGVWaWRlb3NPYmplY3QgZnJvbSAnLi9zdWJtb2R1bGVzL2NyZWF0ZVZpZGVvc09iamVjdC5qcyc7XG5cbmxldCBwbHVnaW5OYW1lID0gJ3ZpZGVvVHJhbnNpdGlvbnMnO1xuXG5jbGFzcyBQbHVnaW4ge1xuXHRjb25zdHJ1Y3RvcihlbCxzZXR0aW5ncykge1xuXHRcdHRoaXMuY29udGFpbmVyID0gZWw7XG5cdFx0dGhpcy4kY29udGFpbmVyID0gJCh0aGlzLmNvbnRhaW5lcik7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IHZpZGVvU2V0dGluZ3Moc2V0dGluZ3MsdGhpcy4kY29udGFpbmVyKTtcblx0XHR0aGlzLnRyYW5zaXRpb25UeXBlID0gdGhpcy5zZXR0aW5ncy50cmFuc2l0aW9uVHlwZTtcblx0XHR0aGlzLnRyYW5zaXRpb25zID0gdmlkZW9UcmFuc2l0aW9ucyh0aGlzKTtcblx0XHR0aGlzLmluaXRUcmFuc0NsYXNzZXMoKTtcblx0XHR0aGlzLmxvb3BpbmcgPSB0aGlzLnNldHRpbmdzLmxvb3Bpbmc7XG5cdFx0dGhpcy4kdmlkZW9zID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJ3ZpZGVvJyk7XG5cdFx0dGhpcy4kY2FwdGlvbnMgPSB0aGlzLiRjb250YWluZXIuZmluZCgnW2RhdGEtanM9XCJjYXB0aW9uXCJdJyk7XG5cdFx0dGhpcy52aWRlb3MgPSBjcmVhdGVWaWRlb3NPYmplY3QodGhpcyk7XG5cdFx0XG5cdFx0JC53aGVuKHZpZGVvVGVzdHMpLmRvbmUoKGJvb2wpPT57XG5cdFx0XHRib29sID8gdGhpcy5wYXNzZWQoKSA6IHRoaXMuZmFpbGVkKCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBkZWZpbmUgdHJhbnNpdGlvbiBjbGFzc2VzIFtmcm9tIHRoaXMudHJhbnNpdGlvbnMgb2JqZWN0XVxuXHRpbml0VHJhbnNDbGFzc2VzKCkge1xuXHRcdGlmKHRoaXMudHJhbnNpdGlvbnMuaGFzT3duUHJvcGVydHkodGhpcy50cmFuc2l0aW9uVHlwZSkpIHtcblx0XHRcdHRoaXMuY2xhc3NQbGF5aW5nID0gdGhpcy50cmFuc2l0aW9uc1t0aGlzLnRyYW5zaXRpb25UeXBlXS5jbGFzc1BsYXlpbmc7XG5cdFx0XHR0aGlzLmNsYXNzT3V0ID0gdGhpcy50cmFuc2l0aW9uc1t0aGlzLnRyYW5zaXRpb25UeXBlXS5jbGFzc091dDtcblx0XHRcdHRoaXMuY2xhc3NEZWZhdWx0ID0gdGhpcy50cmFuc2l0aW9uc1t0aGlzLnRyYW5zaXRpb25UeXBlXS5jbGFzc0RlZmF1bHQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY2xhc3NQbGF5aW5nID0gJyc7XG5cdFx0XHR0aGlzLmNsYXNzT3V0ID0gJyc7XG5cdFx0XHR0aGlzLmNsYXNzRGVmYXVsdCA9ICcnO1xuXHRcdH1cblx0fVxuXHRcblx0cGFzc2VkKCkge1xuXHRcdC8vIGlmIHRoZSBmaXJzdCB2aWRlbyBoYXMgbG9hZGVkIC0+IGdvIC8vXG5cdFx0aWYodGhpcy52aWRlb3NbMF0uZWxlbWVudC5yZWFkeVN0YXRlID49IDQpIHtcblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyB3aGVuIHRoZSBmaXJzdCB2aWRlbyBjYW4gcGxheSAtPiBnbyAvL1xuXHRcdFx0dGhpcy52aWRlb3NbMF0uJGVsZW1lbnQub25lKCdjYW5wbGF5JywoKSA9PiB7IHRoaXMuaW5pdCgpIH0pO1xuXHRcdH1cblx0fVxuXHRcblx0ZmFpbGVkKCkge1xuXHRcdHRoaXMuZmFsbGJhY2tUb0Nhcm91c2VsKCk7XG5cdH1cblxuXHRpbml0KCkge1x0XHRcblx0XHQvLyBoaWRlIHN0YXJ0IGVsZW1lbnRcblx0XHR0aGlzLnNldHRpbmdzLnN0YXJ0LmFkZENsYXNzKCdpbmFjdGl2ZScpO1xuXHRcdFxuXHRcdC8vIGFwcGx5IHRoZSBtdXRlIHN0YXR1cyB0byB0aGUgdmlkZW9zXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IE9iamVjdC5rZXlzKHRoaXMudmlkZW9zKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dGhpcy52aWRlb3NbaV0uZWxlbWVudC5tdXRlZCA9IHRoaXMuc2V0dGluZ3MubXV0ZWQ7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIHBsYXkgdGhlIGZpcnN0IHZpZGVvXG5cdFx0dGhpcy5wbGF5VmlkZW8odGhpcy52aWRlb3NbMF0pO1x0XHRcblx0fVxuXG5cdC8vIGlmIHdlJ3ZlIGJlZW4gZ2l2ZW4gdHJhbnNpdGlvbiBkdXJhdGlvbnMgdGhlbiBzZXQgdGhlbSBvbiB0aGUgZWxlbWVudCAob3ZlcnJpZGVzIHRoZSBDU1MpXG5cdHNldFRyYW5zRHVyYXRpb24oJGVsKSB7XG5cdFx0JGVsWzBdLnN0eWxlLldlYmtpdFRyYW5zaXRpb24gPSBgJHt0aGlzLnRyYW5zaXRpb25zW3RoaXMudHJhbnNpdGlvblR5cGVdLnByb3BlcnR5fSAke3RoaXMuc2V0dGluZ3MudHJhbnNUaW1lfXMgJHt0aGlzLnRyYW5zaXRpb25zW3RoaXMudHJhbnNpdGlvblR5cGVdLmVhc2luZ31gO1xuXHRcdCRlbFswXS5zdHlsZS5Nb3pUcmFuc2l0aW9uID0gYCR7dGhpcy50cmFuc2l0aW9uc1t0aGlzLnRyYW5zaXRpb25UeXBlXS5wcm9wZXJ0eX0gJHt0aGlzLnNldHRpbmdzLnRyYW5zVGltZX1zICR7dGhpcy50cmFuc2l0aW9uc1t0aGlzLnRyYW5zaXRpb25UeXBlXS5lYXNpbmd9YDtcblx0fVxuXG5cdGV2ZW50cyh2aWRlb09iaikge1xuXHRcdGxldCB2aWRlbyA9IHZpZGVvT2JqLmVsZW1lbnQ7XG5cdFx0bGV0ICR2aWRlbyA9IHZpZGVvT2JqLiRlbGVtZW50O1xuXG5cdFx0JHZpZGVvLm9uKCd0aW1ldXBkYXRlJywkLnByb3h5KHRoaXMudGltaW5nLHRoaXMsdmlkZW9PYmopKTtcblx0XHQkdmlkZW8ub24oJ2VuZGVkJywkLnByb3h5KHRoaXMuZW5kVHJhbnNpdGlvbix0aGlzLHZpZGVvT2JqKSk7XG5cdFx0JHZpZGVvLm9uKCdlcnJvcicsJC5wcm94eSh0aGlzLnZpZGVvRXJyb3IsdGhpcyx2aWRlb09iaikpO1xuXHR9XHRcblxuXHQvLy8vIE5PVFJBTlNJVElPTiAvLy8vXG5cdG5vVHJhbnNpdGlvbigpIHtcblx0XHRjb25zb2xlLmxvZygnbm8gdHJhbnNpdGlvbnMgYmVpbmcgYXBwbGllZCB0byB2aWRlb3MnKTtcblx0fVxuXHQvLy8vIE5PVFJBTlNJVElPTiBlbmQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdC8vIGZuIGNhbGxlZCB3aGVuIGVhY2ggdmlkZW8gZW5kc1xuXHRlbmRUcmFuc2l0aW9uKHZpZGVvT2JqKSB7XG5cdFx0dmlkZW9PYmouc3RhdHVzID0gJ3N0b3BwZWQnO1xuXHRcdHZpZGVvT2JqLiR3cmFwLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NQbGF5aW5nICsgJyAnICsgdGhpcy5jbGFzc091dCk7XG5cblx0XHQvLyBpZiBsYXN0IHZpZGVvIGluIGNvbGxlY3Rpb246IGNhbGwgdGhpcy5lbmRlZCB3aGljaCB3aWxsIGVpdGhlciByZXN0YXJ0IG9yIGVuZCB0aGUgcHJvY2Vzc1xuXHRcdHRoaXMubGFzdCh2aWRlb09iaikgPyB0aGlzLmVuZGVkKCkgOiBmYWxzZTtcblx0fVxuXG5cdC8vIGZuIGNhbGxlZCB3aGVuIGVhY2ggdmlkZW8gZW5kcy4gaGlkZXMgY2FwdGlvbnMgaWYgdGhleSBoYXZlbid0IGFscmVhZHkgYmVlbiBoaWRkZW4gYmFzZWQgb24gdGltaW5nXG5cdGhpZGVDYXB0aW9ucygkY2FwdGlvbnMpIHtcblx0XHQkY2FwdGlvbnMuZWFjaCgoaSwgZWwpID0+IHtcblx0XHRcdCQoZWwpLmFkZENsYXNzKCdpbmFjdGl2ZScpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gZm4gY2FsbGVkIHdoZW5ldmVyIHRpbWV1cGRhdGUgZXZlbnQgaXMgZmlyZWQgYnkgcGxheWluZyB2aWRlb3MuIHVzZWQgdG8gY2FsY3VsYXRlIHRyYW5zaXRpb24gdGltaW5nc1xuXHR0aW1pbmcodmlkZW9PYmopIHtcblx0XHRsZXQgdmlkZW8gPSB2aWRlb09iai5lbGVtZW50O1xuXG5cdFx0Ly8gaWYgY3VyclRpbWUgaXMgdGhlIHNldCB0cmFuc2l0aW9uIHRpbWUgZnJvbSB0aGUgZW5kIG9mIHRoZSB2aWRlbyBhbmQgdGhlIHZpZGVvIGlzbid0IGFscmVhZHkgdHJhbnNpdGlvbmluZyB0aGVuIHRyYW5zaXRpb24gdGhlIHZpZGVvLlxuXHRcdHZpZGVvLmN1cnJlbnRUaW1lID4gKHZpZGVvLmR1cmF0aW9uIC0gdGhpcy5zZXR0aW5ncy50cmFuc1RpbWUpICYmIHZpZGVvT2JqLnN0YXR1cyAhPSAndHJhbnNpdGlvbmluZycgPyB0aGlzLnN0YXJ0VHJhbnNpdGlvbih2aWRlb09iaikgOiBmYWxzZTtcblxuXHRcdC8vIGlmIHdlJ3JlIG5vdCBpbiB0aGUgZmlyc3QgcGxheSB0aHJvdWdoIGFuZCB3ZSdyZSBub3QgbG9vcGluZyB0aGUgdGV4dCBkbyBub3RoaW5nXG5cdFx0aWYodGhpcy5zZXR0aW5ncy5yZXN0YXJ0ZWQgJiEgdGhpcy5zZXR0aW5ncy5sb29wdGV4dCl7IFxuXHRcdFx0ZmFsc2U7XG5cdFx0fSBlbHNlIGlmKHZpZGVvT2JqLmNhcHRpb25zICE9PSBudWxsKSB7IC8vIG90aGVyd2lzZSBpZiB3ZSBoYXZlIGNhcHRpb25zLCB0cmFuc2l0aW9uIHRoZW1cblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPD0gKHZpZGVvT2JqLmNhcHRpb25zLmxlbmd0aCAtIDEpOyBpKyspe1xuXHRcdFx0XHRsZXQgc3RhcnQgPSB2aWRlb09iai5jYXB0aW9uc1tpXS5zdGFydDtcblx0XHRcdFx0bGV0IGVuZCA9IHZpZGVvT2JqLmNhcHRpb25zW2ldLmVuZDtcblx0XHRcdFx0bGV0ICRlbCA9IHZpZGVvT2JqLmNhcHRpb25zW2ldLiRlbGVtZW50O1xuXG5cdFx0XHRcdGlmKHN0YXJ0IDw9IHZpZGVvLmN1cnJlbnRUaW1lICYmIGVuZCA+PSB2aWRlby5jdXJyZW50VGltZSkge1xuXHRcdFx0XHRcdCRlbC5yZW1vdmVDbGFzcygnaW5hY3RpdmUnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKGVuZCA8PSB2aWRlby5jdXJyZW50VGltZSAmISAkZWwuaGFzQ2xhc3MoJ2luYWN0aXZlJykpIHtcblx0XHRcdFx0XHQkZWwuYWRkQ2xhc3MoJ2luYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHR2aWRlb0Vycm9yKHZpZGVvT2JqKSB7XG5cdFx0dmlkZW9PYmouZXJyb3IgPSB0cnVlO1xuXHR9XG5cblx0Ly8gc3RhcnQgdGhlIHRyYW5zaXRpb24gb2YgdGhlIHZpZGVvXG5cdHN0YXJ0VHJhbnNpdGlvbih2aWRlb09iaikge1xuXHRcdHZpZGVvT2JqLnN0YXR1cyA9ICd0cmFuc2l0aW9uaW5nJztcblx0XHRsZXQgbmV4dFZpZGVvT2JqID0gdGhpcy5uZXh0VmlkZW8odmlkZW9PYmopO1xuXG5cdFx0dmlkZW9PYmouJHdyYXAuYWRkQ2xhc3ModGhpcy5jbGFzc091dCk7XG5cblx0XHQvLyBpZiBub3QgbGFzdCwgcGxheSB0aGUgbmV4dCB2aWRlbyBFTFNFIGNhbGwgb3VyIGVuZGluZyBmdW5jdGlvblxuXHRcdGlmKCF0aGlzLmxhc3QodmlkZW9PYmopKSB7XG5cdFx0XHR0aGlzLnBsYXlWaWRlbyhuZXh0VmlkZW9PYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmVuZGluZygpO1xuXHRcdH1cblx0fVxuXG5cdC8vIGNoZWNrIGlmIHRoZSB2aWRlb09iamVjdCBwYXNzZWQgaXMgdGhlIGxhc3QgaXRlbSBpbiB0aGUgY29sbGVjdGlvblxuXHRsYXN0KHZpZGVvT2JqKSB7XG5cdFx0aWYodmlkZW9PYmouaW5kZXggPT09IHRoaXMudmlkZW9zLmxlbmd0aCAtIDEpe1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHQvLyBmaW5kIHRoZSBuZXh0IHZpZGVvIGluIHRoZSBjb2xsZWN0aW9uXG5cdG5leHRWaWRlbyh2aWRlb09iaikge1xuXHRcdHJldHVybiB0aGlzLnZpZGVvc1t2aWRlb09iai5pbmRleCArIDFdO1xuXHR9XG5cblx0Ly8gcGxheSB0aGUgdmlkZW8sIGFkZCB0aGUgYXBwcm9wcmlhdGUgY2xhc3NlcyBhbmQgc2V0IHRoZSBvYmplY3QncyBzdGF0dXNcblx0cGxheVZpZGVvKHZpZGVvT2JqKSB7XG5cdFx0dmlkZW9PYmouZWxlbWVudC5wbGF5KCk7XG5cdFx0dmlkZW9PYmouc3RhdHVzID0gJ3BsYXlpbmcnO1xuXHRcdHZpZGVvT2JqLiR3cmFwLmFkZENsYXNzKHZpZGVvT2JqLnN0YXR1cyk7XG5cdH1cblxuXHQvLyByZXN0YXJ0IHRoZSBzZXF1ZW5jZVxuXHRyZXN0YXJ0KCkge1xuXHRcdGlmKHRoaXMubG9vcGluZykge1xuXHRcdFx0dGhpcy5zZXR0aW5ncy5yZXN0YXJ0ZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5pbml0KClcdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0Ly8gbGFzdCB2aWRlbyBpcyB0cmFuc2l0aW9uaW5nIG91dCAtIGJyaW5nIGluIHRoZSBlbmRwb2ludCBzdHVmZi5cblx0ZW5kaW5nKCkge1xuXHRcdHRoaXMuc2V0dGluZ3MuZW5kID8gdGhpcy5zZXR0aW5ncy5lbmQucmVtb3ZlQ2xhc3MoJ2luYWN0aXZlJykgOiBmYWxzZTtcblx0fVxuXG5cdC8vIGxhc3QgdmlkZW8gaGFzIGVuZGVkLCByZXN0YXJ0IG9yIGFsbG93IHRvIGVuZC5cblx0ZW5kZWQoKSB7XG5cdFx0dGhpcy5zZXR0aW5ncy5sb29waW5nID8gdGhpcy5yZXN0YXJ0KCkgOiBmYWxzZTtcblx0fVxuXHRcblx0XG5cdC8vIGRlc3Ryb3kgdmlkZW9UcmFuc1xuXHRcblx0ZGVzdHJveSgpIHtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXModGhpcy52aWRlb3MpLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLnZpZGVvc1tpXS5lbGVtZW50LnBhdXNlKCk7XG5cdFx0XHR0aGlzLnZpZGVvc1tpXS5lbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcblx0XHRcdHRoaXMudmlkZW9zW2ldLiR3cmFwLnJlbW92ZUNsYXNzKHRoaXMudHJhbnNpdGlvbnNbdGhpcy50cmFuc2l0aW9uVHlwZV0uY2xhc3NQbGF5aW5nKTtcblx0XHRcdGRlbGV0ZSB0aGlzLnZpZGVvc1tpXTtcblx0XHR9XG5cdFx0ZGVsZXRlIHRoaXMudmlkZW9zO1xuXHR9XG5cdFxuXHRcblx0Ly8gZmFsbGJhY2sgZm9yIHRob3NlIG5vIGF1dG9wbGF5IGRldmljZXMgYW5kIElFOC5cblx0XG5cdGZhbGxiYWNrVG9DYXJvdXNlbCgpIHtcdFx0XG5cdFx0aWYoTW9kZXJuaXpyLnZpZGVvKSB7XG5cdFx0XHR0aGlzLmluaXRDYXJvdXNlbCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9oR29kSXRzT2xkSWVSdW5Gb3JUaGVIaWxscygpO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gaW5pdGlhbGlzZSBjYXJvdXNlbCBhbmQgc2V0IHVwIG1hcmt1cFxuXHRpbml0Q2Fyb3VzZWwoKSB7XG5cdFx0dGhpcy5jcmVhdGVGYWxsYmFja01hcmt1cCgpO1xuXHRcdHRoaXMuJGZhbGxiYWNrc1dyYXAgPSB0aGlzLiRjb250YWluZXIuZmluZCgnW2RhdGEtanM9XCJmYWxsYmFja1dyYXBcIl0nKTsgXHRcdFxuXHRcdHRoaXMuJGZhbGxiYWNrcyA9IHRoaXMuJGZhbGxiYWNrc1dyYXAuZmluZCgnW2RhdGEtanM9XCJmYWxsYmFja1wiXScpO1xuXHRcdHRoaXMuJGZpcnN0RmFsbGJhY2sgPSB0aGlzLiRmYWxsYmFja3MuZXEoMCk7XG5cblx0XHRzZXRUaW1lb3V0KCgpPT57IHRoaXMucm90YXRlQ2Fyb3VzZWwodGhpcy4kZmlyc3RGYWxsYmFjaykgfSx0aGlzLiRmaXJzdEZhbGxiYWNrLmRhdGEoJ2R1cmF0aW9uJykgKiAxMDAwKTtcblx0fVxuXHRcblx0Ly8gY3JlYXRlIG1hcmt1cCByZXF1aXJlZCBmb3IgY2Fyb3VzZWxcblx0Y3JlYXRlRmFsbGJhY2tNYXJrdXAoKSB7XG5cdFx0dGhpcy5mYWxsYmFja3MgPSBbXTtcdFx0XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IE9iamVjdC5rZXlzKHRoaXMudmlkZW9zKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dGhpcy5mYWxsYmFja3NbdGhpcy52aWRlb3NbaV0uaW5kZXhdID0gdGhpcy52aWRlb3NbaV0uJGZhbGxiYWNrO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLiRjb250YWluZXIuYXBwZW5kKCc8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNfX2ZhbGxiYWNrLXdyYXBcIiBkYXRhLWpzPVwiZmFsbGJhY2tXcmFwXCI+PC9kaXY+Jyk7XG5cdFx0dGhpcy4kZmFsbGJhY2tXcmFwID0gJCgnW2RhdGEtanM9XCJmYWxsYmFja1dyYXBcIl0nKTtcblx0XHRcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXModGhpcy5mYWxsYmFja3MpLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLiRmYWxsYmFja1dyYXAuYXBwZW5kKHRoaXMuZmFsbGJhY2tzW2ldWzBdLm91dGVySFRNTCk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyByb3RhdGUgdGhlIGNhcm91c2VsIGJ5IDEgaW1hZ2Vcblx0cm90YXRlQ2Fyb3VzZWwobmV4dCkge1xuXHRcdGxldCAkY3VycmVudCA9IHRoaXMuJGZhbGxiYWNrc1dyYXAuZmluZCgnLnBsYXlpbmcnKTtcblx0XHRsZXQgJG5leHQgPSBuZXh0O1x0XHRcblx0XHRcblx0XHRpZigkY3VycmVudC5pbmRleCgpID09PSB0aGlzLiRmYWxsYmFja3MubGVuZ3RoIC0gMSkge1xuXHRcdFx0JG5leHQgPSB0aGlzLiRmaXJzdEZhbGxiYWNrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbmV4dCA9ICRjdXJyZW50Lm5leHQoKTtcblx0XHR9XG5cdFx0XG5cdFx0JGN1cnJlbnQucmVtb3ZlQ2xhc3MoJ3BsYXlpbmcnKTtcblx0XHQkbmV4dC5hZGRDbGFzcygncGxheWluZycpO1xuXHRcdFxuXHRcdHNldFRpbWVvdXQoKCRuZXh0KT0+eyB0aGlzLnJvdGF0ZUNhcm91c2VsKCRuZXh0KSB9LCRuZXh0LmRhdGEoJ2R1cmF0aW9uJykgKiAxMDAwKVxuXHR9XG5cdFxuXHRvaEdvZEl0c09sZEllUnVuRm9yVGhlSGlsbHMoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1RoZSBkYXJrIHRpbWVzIGhhdmUgY29tZSBhZ2Fpbi4nKTtcblx0fVxufVxuXG4kLmZuW3BsdWdpbk5hbWVdID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCEkLmRhdGEodGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lKSkge1xuXHRcdFx0cmV0dXJuICQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIG5ldyBQbHVnaW4odGhpcywgb3B0aW9ucykpO1xuXHRcdH1cblx0fSk7XG59OyJdfQ==
