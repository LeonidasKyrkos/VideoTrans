'use strict'


// define out transition/animation classes. Include custom ones passed in during intialisation
let videoTransitions = function(scope) {
    let obj = {
        default: {
            fn: scope.events,
            classPlaying: 'playing',
            classOut: 'fadeOut',
            classDefault: 'fader',
            property: 'opacity',
            easing: 'linear'
        },
        none: {
            fn: scope.noTransition,
            classPlaying: '',
            classOut: '',
            classDefault: '',
            property: '',
            easing: ''
        },
        spin: {
            fn: scope.events,
            classPlaying: 'playing',
            classOut: 'spinOut',
            classDefault: 'spinner',
            property: 'all',
            easing: 'ease-out'
        }
    }
    
    // loop through custom transitions provided by user and add them to our transitions object.
    $.extend(obj,scope.settings.customTransitions);
    if(scope.settings.customTransitions) {
        for(let transition in scope.settings.customTransitions) {
            let clone = $.extend({},obj.default);
            obj[transition] = $.extend(clone,obj[transition]); 
        }
    }
    
    return obj;
}

export default videoTransitions;