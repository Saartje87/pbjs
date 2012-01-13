/**
 * @todo: isMobile
 */
PB.browser = function (){
	
	var ua = navigator.userAgent,
		info;
	
	info = {
		
		isIE: ua.indexOf('MSIE') > -1,
		isChrome: ua.indexOf('Chrome') > -1,
		isFirefox: ua.indexOf('Firefox') > -1,
		isSafari:ua.indexOf('Safari') > -1,
		isOpera: !!window.opera
	};
	
	info.version = info.isIE
		? parseFloat(ua.match(/MSIE (\d+\.\d+)/)[1])
		: parseFloat(ua.match(/(Chrome|Firefox|Version)\/(\d+\.\d+)/)[2]);
	
	return info;
}();

