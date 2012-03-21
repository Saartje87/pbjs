/**
 * @todo: isMobile
 */
PB.browser = function (){
	
	var ua = navigator.userAgent,
		info,
		flash;
	
	info = {
		
		isIE: ua.indexOf('MSIE') > -1,
		isChrome: ua.indexOf('Chrome') > -1,
		isFirefox: ua.indexOf('Firefox') > -1,
		isSafari:ua.indexOf('Safari') > -1,
		isNokiaBrowser: ua.indexOf('NokiaBrowser') > -1,
		isOpera: !!window.opera
	};
	
	info.version = info.isIE
		? parseFloat(ua.match(/MSIE (\d+\.\d+)/)[1])
		: parseFloat(ua.match(/(Chrome|Firefox|Version|NokiaBrowser)\/(\d+\.\d+)/)[2]);
		
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
	
	info.flash = flash || false;
	
	return info;
}();

