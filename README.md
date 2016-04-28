# VideoTrans

VideoTrans allows you to include a series of videos on a page and transition between them one or more times.

Uses:

* HTML5
* CSS3 transitions
* ES6 transpiled with babel


Work in progress!

__________

##Init function with jQuery:

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
