'use strict';

import $ from 'jquery';
import './modules/video';

$('[data-js="video-trans"]').videoTransitions({
	endText: 'Ending text',
	transTime: 1.5,
	startImage: '/media/images/start.png'
});