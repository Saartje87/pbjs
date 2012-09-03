/**
 * 
 */
PB.support = (function () {
	
	var flash;
	
	// Flash detection
	if( navigator.plugins && navigator.plugins['Shockwave Flash'] ) {
		
		flash = navigator.plugins['Shockwave Flash'].description;
	} else if ( window.ActiveXObject ) {
		
		try {
			
			flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
		} catch (e) {}
	}
	
	if( flash ) {
		
		flash = flash.match(/\d+/g);
		flash = Number(flash[0]+'.'+flash[1]);
	}
	
	return {
		
		// Browser support flash? If yes, returns a number <version>
		flash: flash || false,
		touch: 'ontouchstart' in win,
		
		// Set when detecting css properties
		CSSTransition: false,
		CSSAnimation: false
	};
})();

