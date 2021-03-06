/**
 * Get unique id inside PB
 *
 * @return number
 */
PB.id = function () {
	
	return ++uid;
}

/**
 * Overwrite properties or methods in target object
 */
PB.overwrite = function ( target, source ) {

	var key;

	for( key in source ) {

		if( source.hasOwnProperty(key) ) {

			target[key] = source[key];
		}
	}

	return target;
}

/**
 * Extend object
 *
 * Existing values will not be overwritten
 */
PB.extend = function ( target, source ) {

	var key;

	for( key in source ) {

		if( source.hasOwnProperty(key) && target[key] === undefined ) {

			target[key] = source[key];
		}
	}

	return target;
}

/**
 * Walk trough object
 *
 * When returning true in the callback method, the crawling stops
 * 
 * fn arguments: key, value
 * 
 * @param object
 * @param function
 * @param object
 * @return void
 */
PB.each = function ( collection, fn, scope ) {
	
	var prop;
	
	if ( !collection || typeof fn !== 'function' ) {

		return;
	}
	
	for( prop in collection ) {
		
		if( collection.hasOwnProperty(prop) && fn.call(scope, prop, collection[prop], collection) === true ) {
			
			return;
		}
	}
}

/**
 * 
 */
PB.toArray = function ( collection ) {
	
	if( toString.call(collection) === '[object Object]' && collection.length ) {
		
		var result = [],
			length = collection.length,
			i = 0;
		
		for( ; i < length; i++ ) {
			
			result.push( collection[i] );
		}

		return result;
	}
	
	return slice.call(collection);
}

/**
 * Deprecated since 0.5.10
 */
PB.is = function ( type, mixed ) {
	
	return toString.call(mixed) === '[object '+type+']';
}

/**
 * Returns te primitive type of the given variable
 *
 * PB.type([]) -> array
 * PB.type('') -> string
 * PB.type({}) -> object
 *
 * @param {mixed}
 * @return {String}
 */
PB.type = function ( mixed ) {
	
	if( mixed instanceof PB.Dom ) {
		
		return 'PBDom';
	}
	
	if( mixed instanceof PB.Collection ) {
		
		return 'PBDomCollection';
	}
	
	return toString.call(mixed).replace('[object ', '').replace(']', '').toLowerCase();
}

/**
 * Executes script in global scope
 *
 * @param {String}
 * @return {Void}
 */
PB.exec = function ( text ) {
	
	if( window.execScript ) {
		
		window.execScript( text );
	} else {
		
		var script = doc.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		doc.head.appendChild(script);
		doc.head.removeChild(script);
	}
}


//= require "./browser"
//= require "./support"
//= require "./class"
//= require "./observer"

