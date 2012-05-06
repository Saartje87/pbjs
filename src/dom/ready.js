PB.ready = (function () {
	
	var ready = doc.readyState === 'complete',
		queue = [];
	
	function execQueue () {
		
		var callback;
		
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
			
			setTimeout(execQueue, 16.7);
			return;
		}
	}
	
	if( document.addEventListener ) {
		
		PB(document).once('DOMContentLoaded', function () {
			
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
	}
})();

