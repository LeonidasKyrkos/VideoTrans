'use strict';

import $ from 'jquery';
window.$ = $;
import VideoTransitions from './modules/video';

$('[data-js="video"]').each((i, el) => 
	new VideoTransitions($(el),
		{
			looping: true,
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
);