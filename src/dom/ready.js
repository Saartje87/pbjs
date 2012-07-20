PB.ready = (function () {
	
	var ready = doc.readyState === 'complete',
		queue = [];
	
	function execQueue () {
		
		var callback;

		// replace the cached version
		body = document.body;
		
		while( callback = queue.shift() ) {
			
			callback();
		}
	}
	
	// IE ready check
	function domready () {
		
		try {
			
			docElement.doScroll('left');
			execQueue();
		} catch ( e ) {
			
			setTimeout(domready, 16.7);
			return;
		}
	}
	
	if( doc.addEventListener ) {
		
		PB(doc).once('DOMContentLoaded', function () {
			
			ready = true;
			
			execQueue();
		});
	} else {
		
		domready();
	}
	
	return function ( callback ) {
		
		if( !ready ) {
			
			return queue.push( callback );
		}
		
		callback();
	};
})();

