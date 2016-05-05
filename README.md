# VideoTrans

VideoTrans allows you to include a series of videos on a page and transition between them one or more times.

Uses:

* HTML5
* CSS3 transitions
* ES6 transpiled with babel
* jQuery

Work in progress!

__________

##Markup for one video + captions


    <section class="video-trans__outerwrap" data-js="video">
		<ol class="video-trans__videos">
			<li class="video-trans__wrap">
				<video class="video-trans__video">
					<source src="/media/video/test-video.mp4" type="video/mp4">
				</video>
				<span class="video-trans__caption inactive" data-js="caption" data-start="0.5" data-end="1.5">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="2" data-end="3">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="3.5" data-end="4.5">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="5" data-end="6">This is<br><span class="bold">example text</span></span>
				<span class="video-trans__caption inactive" data-js="caption" data-start="6.5" data-end="7.5">This is<br><span class="bold">example text</span></span>
			</li>
		</ol>
	</section>
    
    
##Markup for multiple videos + captions


    <section class="video-trans__outerwrap" data-js="video">
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
	</section>
    

##Init function:

    var $videos = $('[data-js="video-trans"]');

    function initTransVideo() {
            var videoTrans = new VideoTransitions($(this),{
                                    transitionType: 'default',
                                    looping: true,
                                    endText: '',
                                    transTime: 1.5,
                                    startImage: ''
                            });
    }

    $videos.each(initTransVideo);
    
    
    
    
##To do list:

* No autoplay/video fallback
* Tidy up triggers
* Convert to jQuery plugin
* Add more default transition animations