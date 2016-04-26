'use strict';

global.$ = require('jquery');

import VideoTransitions from './modules/video';

$('[data-js="video"]').each((i, el) => new VideoTransitions($(el),{looping: true,endText: 'Ending text',transTime: 1.5,startImage: '/media/images/start.png'}));