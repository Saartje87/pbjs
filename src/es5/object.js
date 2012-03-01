PB.extend(Object, {
	
	/**
	 * Retrieve keys from object as array
	 * 
	 * @param object object
	 * @return array
	 */
	keys: function ( object ) {
		
		if ( this === null || PB.is('Object', object) === false ) {

			throw new TypeError();
		}

		var result = [],
			key;

		for( key in object ) {
				
			if( object.hasOwnProperty( key ) ) {

				result.push( key );
			}
		}

		return result;
	},
	
	/**
	 * Nasty solution to retrieve objectPrototype
	 *
	 * Note: constructor could be overwriten.. so it`s not the best solution
	 * Todo: Test, test, test... fix fix fix! Not working properly
	 */
	getPrototypeOf: function ( object ) {
		
		var constructor = object.constructor,
			oldConstructor;
		
		// Non IE browsers
		if( typeof object.__proto__ !== "undefined" ) {
			
			return object.__proto__;
		}
		
		if( object.hasOwnProperty( object.constructor ) ) {
			
			oldConstructor = object.constructor;
			
			if( (delete object.constructor) === false ) {
				
				return null;
			}
			
			constructor = object.constructor;
			object.constructor = oldConstructor;
		}
		
		return constructor ? constructor.prototype : null;
	}
});

