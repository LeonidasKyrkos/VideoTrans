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


    <div class="video-trans__outerwrap" data-js="video-trans">
    	<div class="video-trans__videos">
    		<div class="video-trans__wrap">
    			<video class="video-trans__video" data-js="video-trans.video">
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.mp4" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.ogv" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.webm" />
    			</video>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="1.5" data-end="8">Caption 1</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="9.5" data-end="15.5">Caption 2</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="17" data-end="26.5">Caption 3</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="28" data-end="35.5">Caption 4</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="37" data-end="44.5">Caption 5</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="46" data-end="53.5">Caption 6</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="55" data-end="62">Caption 7</span>
    		</div>
    	</div>
    </div>
    
    
##Markup for multiple videos + captions


    <div class="video-trans__outerwrap" data-js="video-trans">
    	<div class="video-trans__videos">
    		<div class="video-trans__wrap">
    			<video class="video-trans__video" data-js="video-trans.video">
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.mp4" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.ogv" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.webm" />
    			</video>
    			<video class="video-trans__video" data-js="video-trans.video">
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.mp4" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.ogv" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.webm" />
    			</video>
    			<video class="video-trans__video" data-js="video-trans.video">
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.mp4" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.ogv" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.webm" />
    			</video>
    			<video class="video-trans__video" data-js="video-trans.video">
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.mp4" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.ogv" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.webm" />
    			</video>
    			<video class="video-trans__video" data-js="video-trans.video">
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.mp4" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.ogv" />
    				<source src="" type="video/mp4" data-src="https://1234567.cloudfront.net/videos/video-src.webm" />
    			</video>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="1.5" data-end="8">Caption 1</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="9.5" data-end="15.5">Caption 2</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="17" data-end="26.5">Caption 3</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="28" data-end="35.5">Caption 4</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="37" data-end="44.5">Caption 5</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="46" data-end="53.5">Caption 6</span>
    			<span class="video-trans__caption inactive" data-js="video-trans.caption" data-start="55" data-end="62">Caption 7</span>
    		</div>
    	</div>
    </div>
    

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