'use strict'

import $ from 'jquery';

let videoTests = function(){
	let def = new $.Deferred();
	def.promise();
	
	// run tests for Modernizr and videoautoplay	
	if(typeof Modernizr !== 'undefined') {
		// manual timeout fallback. If we can't play the first video within 3 seconds then fallback to carousel //
		let timer = setTimeout(()=>{ def.resolve(false); },3000);
		if(Modernizr.videoautoplay) {
			clearTimeout(timer);
			def.resolve(true);
		} else if(!Modernizr.videoautoplay && typeof Modernizr.videoautoplay !== 'undefined') {
			def.resolve(false);
		}
		Modernizr.on('videoautoplay',(result) => {
			Modernizr.videoautoplay = result;
			clearTimeout(timer);
			if (result) {
				def.resolve(true);
			} else {					
				def.resolve(false);
			}
		});
	} else {
		def.resolve(true);
	}
	
	return def;
}


export default videoTests;