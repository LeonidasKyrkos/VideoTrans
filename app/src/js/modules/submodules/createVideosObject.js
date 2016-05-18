'use strict'

import $ from 'jquery';
import createCaptionsObject from './createCaptionsObject.js';


// collect all the videos and add event listeners for transitions. If captions are available, assign them
let createVideosObject = function(scope) {
    let videos = [];
    let video;

    scope.$videos.each((i, el) => {
        let $el = $(el);
        videos[i] = video = {};

        video.$element = $el;
        video.$wrap = video.$element.parent();
        video.element = el;
        video.index = i;
        video.status = 'stopped';
        video.captions = createCaptionsObject(scope,video);
        video.$fallback = video.$wrap.find('[data-js="fallback"]');			
        scope.setTransDuration(video.$fallback);
        video.error = false;

        scope.setTransDuration(video.$wrap);
        video.$wrap.addClass(scope.classDefault);

        // sort out transition type and fallback //
        let fn = scope.transitions.hasOwnProperty(scope.transitionType) ? scope.transitions[scope.transitionType].fn.bind(scope) : null;

        if(fn === null) {
            console.log(`You have passed an unknown transition type ${scope.transitionType} - reverting to default of fade`);
            fn = scope.transitions['default'].fn.bind(scope);
        }

        fn(video);
    });

    return videos;
}

export default createVideosObject;