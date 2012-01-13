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

	// Get node
	if( typeof element === 'string' ) {

		element = doc.getElementById( element );
	}

	// Check node
	if( (!element || (element.nodeType !== 1 && element.nodeType !== 9)) && element !== window ) {

		return null;
	}

	// In cache?
	if( typeof element.__PBJS_ID__ === 'number' && cache.hasOwnProperty(element.__PBJS_ID__) === true ) {

		return cache[element.__PBJS_ID__];
	}

	// Set cache id
	element.__PBJS_ID__ = PB.id();

	return cache[element.__PBJS_ID__] = new Dom( element );
};

Dom.get.extend = function ( methods ) {
	
	if( arguments.length === 2 ) {
		
		Dom.prototype[arguments[0]] = arguments[1];
		return;
	}
	
	// Extend Dom prototype
	PB.extend( Dom.prototype, methods );
};

