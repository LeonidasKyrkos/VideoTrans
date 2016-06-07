# VideoTrans

Video transitioning jQuery plugin which provides a system for implementing transitioning videos overlayed with timed text effects. Can be used with single video if only captions are required or multiple videos if video transitions are required.

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
				<span class="video-trans__fallback" data-duration="2" data-js="fallback" style="background-image: url('/media/images/fallback.jpg')"></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__fallback" data-duration="2" data-js="fallback" style="background-image: url('/media/images/fallback2.jpg')"></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 2</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__fallback" data-duration="2" data-js="fallback" style="background-image: url('/media/images/fallback3.jpg')"></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text3</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__fallback" data-duration="2" data-js="fallback" style="background-image: url('/media/images/fallback4.jpg')"></span>
				<span class="video-trans__caption" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 3</span></span>
			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__fallback" data-duration="2" data-js="fallback" style="background-image: url('/media/images/fallback5.jpg')"></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 4</span></span>

			</li>
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__fallback" data-duration="2" data-js="fallback" style="background-image: url('/media/images/fallback6.jpg')"></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="1.5" data-end="4.5">This is<br><span class="bold">example text 5</span></span>
			</li>
		</ol>
	</div>
    

##Init function:
    
    $('[data-js="video-trans"]').videoTrans();
    

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
	
    $('[data-js="video-trans"]').videoTrans({
		transitionType: 'spin',
		looping: true,
		startImage: '/media/images/start.png',
		customTransitions: {
			example: {
				classOut: 'exampleOut',
				classPlaying: 'playingExample'
				classDefault: 'example',
				easing: 'ease-in'
			}
		}
    })


##CSS

Now just include main.css on the page and you're good to go.

**L Kyrkos © Redsnapper 2016**