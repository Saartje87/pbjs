/**
 * Get unique id inside PB
 *
 * @return number
 */
PB.id = function () {
	
	return ++uid;
};

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
};

/**
 * Extend object
 *
 * Existing values will not be overwritten
 */
PB.extend = function ( target, source ) {

	var key;

	for( key in source ) {

		if( source.hasOwnProperty(key) && typeof target[key] === 'undefined' ) {

			target[key] = source[key];
		}
	}

	return target;
};

/**
 * Each trough object
 * 
 * fn arguments: key, value
 * 
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
};

/**
 *
 */
PB.toArray = function ( collection ) {
	
	if( toString.call(collection) === '[object Object]' ) {
		
		var result = [],
			length = collection.length,
			i = 0;
		
		for( ; i < length; i++ ) {
			
			result[i] = collection[i];
		}

		return result;
	}
	
	return slice.call(collection);
};

/**
 *
 */
PB.is = function ( type, mixed ) {
	
	return toString.call(mixed) === '[object '+type+']';
};


//= require "./browser"
//= require "./class"
//= require "./observer"

