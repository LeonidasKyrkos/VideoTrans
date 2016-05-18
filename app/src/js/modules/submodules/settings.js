'use strict'


// create settings object using class' second parameter or defaults
let videoSettings = function(settings,$container) {
    let x = {
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
    }
    
    $.extend(x,settings);
    
    
    !x.startImage ? false : $container.prepend(`<div data-js="startpoint" class="video-trans__startpoint--img" style="background-image: url('${x.startImage}')"><!--[a]--></div>`);

    // if end image or text then add markup and then add it to the settings.end property
    !x.endImage ? false : $container.prepend(`<div data-js="endpoint" class="video-trans__endpoint--img inactive"><!--[a]--></div>`);
    !x.endText ? false : $container.prepend(`<h1 data-js="endpoint" class="video-trans__endpoint--text inactive">${x.endText}</h1>`);

    x.start = $('[data-js="startpoint"]');
    x.end = $('[data-js="endpoint"]');

    return x;
}

export default videoSettings;