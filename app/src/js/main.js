/*
	Video transitioning jquery plugin v0.15 [parity with 0.65 of default version] written by L Kyrkos (c) Redsnapper 2016
	Plugin aims to provide a system for implementing transitioning videos interlinked with timed text effects
	Can be used with single video if only captions are required or multiple videos if video transitions are required
	leo@redsnapper.net for questions
*/

'use strict';

import videoSettings from './modules/settings.js';
import videoTransitions from './modules/transitions.js';
import videoTests from './modules/tests.js';
import createVideosObject from './modules/createVideosObject.js';

let pluginName = 'videoTrans';

class Plugin {
	constructor(el,settings) {
		this.container = el;
		this.$container = $(this.container);
		this.settings = videoSettings(settings,this.$container);
		this.transitionType = this.settings.transitionType;
		this.transitions = videoTransitions(this);
		this.initTransClasses();
		this.looping = this.settings.looping;
		this.$videos = this.$container.find('video');
		this.$captions = this.$container.find('[data-js="caption"]');
		this.videos = createVideosObject(this);
		
		videoTests().done((bool)=>{
			bool ? this.passed() : this.failed();
		});
	}

	// define transition classes [from this.transitions object]
	initTransClasses() {
		if(this.transitions.hasOwnProperty(this.transitionType)) {
			this.classPlaying = this.transitions[this.transitionType].classPlaying;
			this.classOut = this.transitions[this.transitionType].classOut;
			this.classDefault = this.transitions[this.transitionType].classDefault;
		} else {
			this.classPlaying = '';
			this.classOut = '';
			this.classDefault = '';
		}
	}
	
	passed() {
		// if the first video has loaded -> go //
		if(this.videos[0].element.readyState >= 4) {
			this.init();
		} else {
			// when the first video can play -> go //
			this.videos[0].$element.one('canplay',() => { this.init() });
		}
	}
	
	failed() {
		this.fallbackToCarousel();
		if(Modernizr) {
			Modernizr.videoautoplay = false;
		}
		$('html').addClass('no-videoautoplay');
	}

	init() {		
		// hide start element
		this.settings.start.addClass('inactive');
		
		// apply the mute status to the videos
		for(var i = 0; i < Object.keys(this.videos).length; i++) {
			this.videos[i].element.muted = this.settings.muted;
		}
		
		// play the first video
		this.playVideo(this.videos[0]);		
	}

	// if we've been given transition durations then set them on the element (overrides the CSS)
	setTransDuration($el) {
		$el[0].style.WebkitTransition = `${this.transitions[this.transitionType].property} ${this.settings.transTime}s ${this.transitions[this.transitionType].easing}`;
		$el[0].style.MozTransition = `${this.transitions[this.transitionType].property} ${this.settings.transTime}s ${this.transitions[this.transitionType].easing}`;
	}

	events(videoObj) {
		let video = videoObj.element;
		let $video = videoObj.$element;

		$video.on('timeupdate',$.proxy(this.timing,this,videoObj));
		$video.on('ended',$.proxy(this.endTransition,this,videoObj));
		$video.on('error',$.proxy(this.videoError,this,videoObj));
	}	

	//// NOTRANSITION ////
	noTransition() {
		console.log('no transitions being applied to videos');
	}
	//// NOTRANSITION end /////////////////////////

	// fn called when each video ends
	endTransition(videoObj) {
		videoObj.status = 'stopped';
		videoObj.$wrap.removeClass(this.classPlaying + ' ' + this.classOut);

		// if last video in collection: call this.ended which will either restart or end the process
		this.last(videoObj) ? this.ended() : false;
	}

	// fn called when each video ends. hides captions if they haven't already been hidden based on timing
	hideCaptions($captions) {
		$captions.each((i, el) => {
			$(el).addClass('inactive');
		});
	}

	// fn called whenever timeupdate event is fired by playing videos. used to calculate transition timings
	timing(videoObj) {
		let video = videoObj.element;

		// if currTime is the set transition time from the end of the video and the video isn't already transitioning then transition the video.
		video.currentTime > (video.duration - this.settings.transTime) && videoObj.status != 'transitioning' ? this.startTransition(videoObj) : false;

		// if we're not in the first play through and we're not looping the text do nothing
		if(this.settings.restarted &! this.settings.looptext){ 
			false;
		} else if(videoObj.captions !== null) { // otherwise if we have captions, transition them
			for(var i = 0; i <= (videoObj.captions.length - 1); i++){
				let start = videoObj.captions[i].start;
				let end = videoObj.captions[i].end;
				let $el = videoObj.captions[i].$element;

				if(start <= video.currentTime && end >= video.currentTime) {
					$el.removeClass('inactive');
				}

				if(end <= video.currentTime &! $el.hasClass('inactive')) {
					$el.addClass('inactive');
				}
			}
		}
	}

	videoError(videoObj) {
		videoObj.error = true;
	}

	// start the transition of the video
	startTransition(videoObj) {
		videoObj.status = 'transitioning';
		let nextVideoObj = this.nextVideo(videoObj);

		videoObj.$wrap.addClass(this.classOut);

		// if not last, play the next video ELSE call our ending function
		if(!this.last(videoObj)) {
			this.playVideo(nextVideoObj);
		} else {
			this.ending();
		}
	}

	// check if the videoObject passed is the last item in the collection
	last(videoObj) {
		if(videoObj.index === this.videos.length - 1){
			return true;
		} else {
			return false;
		}
	}

	// find the next video in the collection
	nextVideo(videoObj) {
		return this.videos[videoObj.index + 1];
	}

	// play the video, add the appropriate classes and set the object's status
	playVideo(videoObj) {
		videoObj.element.play();
		videoObj.status = 'playing';
		videoObj.$wrap.addClass(videoObj.status);
	}

	// restart the sequence
	restart() {
		if(this.looping) {
			this.settings.restarted = true;
			this.init()			
		} else {
			false;
		}
	}

	// last video is transitioning out - bring in the endpoint stuff.
	ending() {
		this.settings.end ? this.settings.end.removeClass('inactive') : false;
	}

	// last video has ended, restart or allow to end.
	ended() {
		this.settings.looping ? this.restart() : false;
	}
	
	
	// destroy videoTrans
	
	destroy() {
		if(this.videos) {
			for(var i = 0; i < Object.keys(this.videos).length; i++) {
				this.videos[i].element.pause();
				this.videos[i].element.currentTime = 0;
				this.videos[i].$wrap.removeClass(this.transitions[this.transitionType].classPlaying);
				delete this.videos[i];
			}
			delete this.videos;
		}
	}
	
	
	// fallback for those no autoplay devices and IE8.
	
	fallbackToCarousel() {		
		if(Modernizr.video) {
			this.initCarousel();
		} else {
			this.ohGodItsOldIeRunForTheHills();
		}
	}
	
	// initialise carousel and set up markup
	initCarousel() {
		this.createFallbackMarkup();
		this.$fallbacksWrap = this.$container.find('[data-js="fallbackWrap"]'); 		
		this.$fallbacks = this.$fallbacksWrap.find('[data-js="fallback"]');
		this.$firstFallback = this.$fallbacks.eq(0);
		this.$firstFallback.addClass('playing');

		setTimeout(()=>{ this.rotateCarousel(this.$firstFallback) },this.$firstFallback.data('duration') * 1000);
	}
	
	// create markup required for carousel
	createFallbackMarkup() {
		this.fallbacks = [];		
		for(var i = 0; i < Object.keys(this.videos).length; i++) {
			this.fallbacks[this.videos[i].index] = this.videos[i].$fallback;
		}
		
		this.$container.append('<div class="video-trans__fallback-wrap" data-js="fallbackWrap"></div>');
		this.$fallbackWrap = $('[data-js="fallbackWrap"]');
		
		for(var i = 0; i < Object.keys(this.fallbacks).length; i++) {
			this.$fallbackWrap.append(this.fallbacks[i][0].outerHTML);
		}
	}
	
	// rotate the carousel by 1 image
	rotateCarousel(next) {
		let $current = this.$fallbacksWrap.find('.playing');
		let $next = next;		
		
		if($current.index() === this.$fallbacks.length - 1) {
			$next = this.$firstFallback;
		} else {
			$next = $current.next();
		}
		
		$current.removeClass('playing');
		$next.addClass('playing');
		
		setTimeout(($next)=>{ this.rotateCarousel($next) },$next.data('duration') * 1000)
	}
	
	ohGodItsOldIeRunForTheHills() {
		console.log('The dark times have come again.');
	}
}

$.fn[pluginName] = function (options) {
	return this.each(function () {
		if (!$.data(this, "plugin_" + pluginName)) {
			return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
		}
	});
};