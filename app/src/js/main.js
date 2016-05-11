'use strict';

import $ from 'jquery';
import VideoTransitions from './modules/video';


new VideoTransitions($('[data-js="video-trans"]'),
	{
		endText: 'Ending text',
		transTime: 1.5,
		startImage: '/media/images/start.png'
	}
	,
	{
		example: {
			classOut: 'exampleOut',
			classDefault: 'example',
			property: 'max-height',
			easing: 'ease-in'
		}
	}
)