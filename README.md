# VideoTrans

Video transitioning jQuery plugin
Plugin aims to provide a system for implementing transitioning videos interlinked with timed text effects.
Can be used with single video if only captions are required or multiple videos if video transitions are required.
*Email questions to leo@redsnapper.net*

Demo page: http://leonidaskyrkos.github.io/

Uses:

* HTML5
* CSS3 transitions
* ES6 transpiled with babel


----

Supported browsers:

* Chrome
* Safari
* Firefox
* Vivaldi
* Edge
* IE11
* IE10
* IE9
* **iOS and other no autoplay devices supported via fallback to CSS image transition**

**If you want fallback support for non-autoplay browsers and devices then please include the relevant Modernizr checks found in the link below**

http://modernizr.com/download?-video-videoautoplay

__________

##Markup for one video + captions


    <div class="video-trans__outerwrap" data-js="video">
		<div class="video-trans__videos">
			<div class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="0.5" data-end="1.5">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="2" data-end="3">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="3.5" data-end="4.5">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="5" data-end="6">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="6.5" data-end="7.5">This is<br><span class="bold">example text</span></span>
			</div>
		</div>
	</div>
    
    
##Markup for multiple videos + captions


    <div class="video-trans__outerwrap" data-js="video">
		<ol class="video-trans__videos">
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 2</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text3</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 3</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 4</span></span>

			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 5</span></span>
			</li>
		</ol>
	</div>
    

##Init function:

    $('[data-js="video-trans"]').each(()=>{
    	new VideoTransitions($(this),[{settings}],[{custom transition classes}])
    });
    

##Default settings (param 2)

    let settings = {
		transitionType: 'default', // default = fade over
		looping: true, // true for looping
		transTime: 3, // transition duration
		loopText: false, // include the captions in the loop
		startImage: false, // Initial image (displayed while loading)
		endText: false, // text to remain when looping video
		endImage: false, // final image if no looping video
		muted: true
	}

#####Passing your own settings
	
    $('[data-js="video-trans"]').each(()=>{
    	new VideoTransitions($(this),{
			transitionType: 'spin',
			looping: true,
			startImage: '/media/images/start.png',
			customTransitions: {
				example: {
					classOut: 'exampleOut',
					classPlaying: 'playingExample'
					classDefault: 'example',
					property: 'max-height',
					easing: 'ease-in'
				}
			}
		})
    })


**L Kyrkos © Redsnapper 2016**