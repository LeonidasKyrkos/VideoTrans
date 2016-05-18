'use strict'

import $ from 'jquery';

// fn called during video collection -> assigns relevant captions to passed video
let createCaptionsObject = function(scope,video) {
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
            scope.setTransDuration($el);
        });
        return captions;
    } else {
        return null;
    }
}

export default createCaptionsObject;