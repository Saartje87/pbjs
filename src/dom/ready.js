PB.ready = (function () {
	
	var ready = !!doc.body || doc.readyState === 'complete',
		queue = [],
		eventMethod = doc.addEventListener ? 'addEventListener' : 'attachEvent',
		eventMethodRemove = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
		eventTypePrefix = doc.addEventListener ? '' : 'on';
	
	function handleState () {
		
		if( ready || doc.readyState !== 'complete' ) {
			
			return;
		}
		
		var fn;
		
		ready = true;
		
		doc[eventMethodRemove](eventTypePrefix+'DOMContentLoaded', handleState, false);
		doc[eventMethodRemove](eventTypePrefix+'readystatechange', handleState, false);
		window[eventMethodRemove](eventTypePrefix+'load', handleState, false);

		while( fn = queue.shift() ) {

			fn();
		}

		queue = null;
	}
	
	if( !ready ) {
		
		doc[eventMethod](eventTypePrefix+'DOMContentLoaded', handleState, false);
		doc[eventMethod](eventTypePrefix+'readystatechange', handleState, false);
		window[eventMethod](eventTypePrefix+'load', handleState, false);
	}
	
	/**
	 * Ananomous queue method
	 */
	return function ( fn ) {
		
		if( ready ) {
			
			fn();
		} else if ( queue.indexOf(fn) === -1 ) {
			
			queue.push( fn );
		}
	};
})();

