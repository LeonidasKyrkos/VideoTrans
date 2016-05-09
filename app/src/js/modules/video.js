/*
	Video transitioning plugin v0.5 written by L Kyrkos (c) Redsnapper 2016
	Plugin aims to provide a system for implementing transitioning videos interlinked with timed text effects
	Can be used with single video if only captions are required or multiple videos if video transitions are required
	leo@redsnapper.net for questions
*/

import $ from 'jquery';

class VideoTransitions {
	constructor($el,settings,transitions) {
		this.$container = $el;
		this.customTransitions = transitions;
		this.settings = this.setup(settings);
		this.transitionType = this.settings.transitionType;
		this.transitions = this.initTransObject();
		this.initTransClasses();
		this.looping = this.settings.looping;
		this.$videos = this.$container.find('video');
		this.$captions = this.$container.find('[data-js="caption"]');
		this.videos = this.getVideos();
		
		this.tests();
	}

	// create settings object using class' second parameter or defaults
	setup(settings) {
		let x = {
			transitionType: 'default',
			looping: false,
			transTime: 3,
			loopText: false,
			startImage: false,
			endText: false,
			endImage: false,
			restarted: false
		}
		x
		Object.assign(x,settings);
		
		!x.startImage ? false : this.$container.prepend(`<div data-js="startpoint" class="video-trans__startpoint--img" style="background-image: url('${x.startImage}')"><!--[a]--></div>`);

		// if end image or text then add markup and then add it to the settings.end property
		!x.endImage ? false : this.$container.prepend(`<div data-js="endpoint" class="video-trans__endpoint--img inactive"><!--[a]--></div>`);
		!x.endText ? false : this.$container.prepend(`<h1 data-js="endpoint" class="video-trans__endpoint--text inactive">${x.endText}</h1>`);

		x.start = $('[data-js="startpoint"]');
		x.end = $('[data-js="endpoint"]');

		return x;
	}

	// define out transition/animation classes. Include custom ones passed in during intialisation
	initTransObject() {
		let obj = {
			default: {
				fn: this.events,
				classPlaying: 'playing',
				classOut: 'fadeOut',
				classDefault: 'fader',
				property: 'opacity',
				easing: 'linear'
			},
			none: {
				fn: this.noTransition,
				classPlaying: '',
				classOut: '',
				classDefault: '',
				property: '',
				easing: ''
			},
			spin: {
				fn: this.events,
				classPlaying: 'playing',
				classOut: 'spinOut',
				classDefault: 'spinner',
				property: 'all',
				easing: 'ease-out'
			}
		}
		
		// loop through custom transitions provided by user and add them to our transitions object.
		Object.assign(obj,this.customTransitions);
		for(let transition in this.customTransitions) {
			let clone = Object.assign({},obj.default)
			obj[transition] = Object.assign(clone,obj[transition]); 
		}
		
		return obj;
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
	
	tests() {		
		if(typeof Modernizr !== 'undefined') {
			Modernizr.on('videoautoplay',(result) => {
				if (result) {					
					this.passed();
				} else {					
					this.failed();
				}
			});
		} else {
			console.log(`You haven't included Modernizr on the page. VideoTrans won't be able to fallback if you're on a device without video or autoplay capabilities`);
			this.passed();
		}
	}
	
	passed() {
		// when the first video can play -> go //
		this.videos[0].$element.one('canplay',() => { this.init() });
	}
	
	failed() {
		this.fallbackToCarousel();
	}

	init() {		
		// hide start element
		this.settings.start.addClass('inactive');

		// play the first video
		this.playVideo(this.videos[0]);		
	}

	// collect all the videos and add event listeners for transitions. If captions are available, assign them
	getVideos() {
		let videos = [];
		let video;

		this.$videos.each((i, el) => {
			let $el = $(el);
			videos[i] = video = {};

			video.$element = $el;
			video.$wrap = video.$element.parent();
			video.element = el;
			video.index = i;
			video.status = 'stopped';
			video.captions = this.assignCaptions(video);
			video.$fallback = video.$wrap.find('[data-js="fallback"]');
			
			this.setTransDuration(video.$fallback);
			video.error = false;

			this.setTransDuration(video.$wrap);
			video.$wrap.addClass(this.classDefault);

			// sort out transition type and fallback //
			let fn = this.transitions.hasOwnProperty(this.transitionType) ? this.transitions[this.transitionType].fn.bind(this) : null;

			if(fn === null) {
				console.log(`You have passed an unknown transition type ${this.transitionType} - reverting to default of fade`);
				fn = this.transitions['default'].fn.bind(this);
			}

			fn(video);
		});

		return videos;
	}

	// if we've been given transition durations then set them on the element (overrides the CSS)
	setTransDuration($el) {
		$el[0].style.WebkitTransition = `${this.transitions[this.transitionType].property} ${this.settings.transTime}s ${this.transitions[this.transitionType].easing}`;
		$el[0].style.MozTransition = `${this.transitions[this.transitionType].property} ${this.settings.transTime}s ${this.transitions[this.transitionType].easing}`;
	}

	// fn called during video collection -> assigns relevant captions to passed video
	assignCaptions(video) {
		video.$captions = video.$wrap.find('[data-js="caption"]');
		let captions = [];
		let caption;

		if(video.$captions !== null) {
			video.$captions.each((i, el) => {
				let $el = $(el);

				captions[i] = {};
				captions[i].$element = $el;
				captions[i].start = $el.data('start');
				captions[i].end = $el.data('end');
				this.setTransDuration($el);
			});

			return captions;
		} else {
			return null;
		}
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
	
	
	// fallback for those no autoplay devices and IE8.
	
	fallbackToCarousel() {		
		if(Modernizr.video) {
			console.log(`We have video but no autoplay. Let's make a carousel.`)
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

		setTimeout(()=>{ this.rotateCarousel(this.$firstFallback) },this.$firstFallback.data('duration') * 1000);
	}
	
	// create markup required for carousel
	createFallbackMarkup() {
		this.fallbacks = [];		
		for(let video of this.videos) {
			this.fallbacks[video.index] = video.$fallback;
		}
		
		this.$container.append('<div class="video-trans__fallback-wrap" data-js="fallbackWrap"></div>');
		this.$fallbackWrap = $('[data-js="fallbackWrap"]');
		
		for(let $fallback of this.fallbacks) {
			this.$fallbackWrap.append($fallback[0].outerHTML);
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

export default VideoTransitions;