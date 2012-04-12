var exprIsHtml = /<\w*[^>]>/;

/**
 * Retrieve element with Dom closure
 */
Dom.get = function ( element ) {
	
	if( !element ) {

		return null;
	}

	// Already a closure?
	if( element instanceof Dom ) {

		return element;
	}

	// Handle string argument
	if( typeof element === 'string' ) {
		
		if( exprIsHtml.test(element) ) {
			
			return Dom.create( element );
		}

		element = doc.getElementById( element );
	}

	// Check node
	if( (!element || (element.nodeType !== 1 && element.nodeType !== 9)) && element !== window ) {

		return null;
	}

	// In cache?
	if( typeof element.__PBJS_ID__ === 'number' && cache.hasOwnProperty(element.__PBJS_ID__) ) {

		return cache[element.__PBJS_ID__];
	}

	// Set cache id
	element.__PBJS_ID__ = PB.id();

	return cache[element.__PBJS_ID__] = new Dom( element );
};

