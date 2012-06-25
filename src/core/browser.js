/**
 * @todo: isMobile
 */
PB.browser = function (){
	
	var ua = navigator.userAgent,
		info,
		version;

	// Version match regexp
	version = ua.match(/(?:MSIE|Chrome|Firefox|Version|NokiaBrowser)(?:\s|\/)(\d+\.\d+)/);
		
	info = {

		isIE: ua.indexOf('MSIE') > -1,
		isChrome: ua.indexOf('Chrome') > -1,
		isFirefox: ua.indexOf('Firefox') > -1,
		isSafari:ua.indexOf('Safari') > -1,
		isOpera: !!window.opera,
		// Parse version if avaible
		version: version ? parseFloat(version[1]) : -1
	};

	return info;
}();

