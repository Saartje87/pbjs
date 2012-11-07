/**
 * 
 */
PB.ready = (function () {

	var ready = doc.readyState === 'complete',
		queue = [];

	function execQueue () {

		var callback;

		ready = true;
		body = doc.body;

		while( callback = queue.shift() ) {

			callback();
		}
	}

	function domready () {

		try {

			// docElement.doScroll('left');
			// Body existing? Experimental.. Solves iframe issue were body
			// is not existing
			doc.body.scrollLeft;
			execQueue();
		} catch ( e ) {

			setTimeout(domready, 16.7);
			return;
		}
	}

	if( doc.addEventListener ) {

		PB(doc).once('DOMContentLoaded', execQueue);
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

