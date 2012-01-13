/**
 * Implementation to check if object is an array
 *
 * @param mixed object
 * @return boolean
 */
PB.extend(Array, {
	
	isArray: function ( object) {
		
		return PB.is('Array', object);
	}
});

PB.extend(Array.prototype, {
	
	/**
	 * Iterate trough array
	 *
	 * @param function fn
	 * @param mixed scope
	 * @param void
	 */
	forEach: function ( fn, scope ) {
		
		if ( this === null || typeof fn !== 'function' ) {

			throw new TypeError();
		}
		
		var length = this.length,
			i = 0;
		
		while ( i < length ) {
			
			fn.call(scope, this[i], i, this);
			
			i++;
		}
	},
	
	/**
	 * Searches the given array for a value and returns the found index or -1 if none found
	 *
	 * Note! Comparsion is done with ===
	 *
	 * @param mixed searchValue
	 * @param integer startIndex
	 * @return integer
	 */
	indexOf: function ( searchValue, startIndex ) {
		
		if ( this === null ) {

			throw new TypeError();
		}
		
		var length = this.length;
		
		startIndex = startIndex || 0;
		
		if( length <= startIndex || length === 0 ) {
			
			return -1;
		}
		
		while( startIndex < length ) {
			
			if ( this[startIndex] === searchValue ) {
				
				return startIndex;
			}
			
			startIndex++;
		}

	    return -1;
	},
	
	/**
	 * Searches the given array reversed for a value and returns the found index or -1 if none found
	 *
	 * Note! Comparsion is done with ===
	 *
	 * @param mixed searchValue
	 * @param integer stopIndex
	 * @return integer
	 */
	lastIndexOf: function ( searchValue, stopIndex ) {
		
		if ( this === null ) {

			throw new TypeError();
		}
		
		var length = this.length;
		
		stopIndex = stopIndex || 0;
		
		if( length <= stopIndex || length === 0 ) {
			
			return -1;
		}
		
		while( stopIndex <= length ) {
		
			length--;
			
			if ( this[length] === searchValue ) {
				
				return length;
			}
		}

	    return -1;
	},
	
	/**
	 * Iterate trough array and return new array with filtered values
	 *
	 * @param function fn
	 * @param scope mixed
	 * @return array
	 */
	filter: function ( fn, scope ) {
		
		if ( this === null || typeof fn !== "function" ) {
			
			throw new TypeError();
		}

		var result = [],
			i = 0,
			length = this.length;
		
		while ( i < length ) {
			
			if( !!fn.call(scope, this[i], i, this) ) {

				result.push( this[i] );
			}
			
			i++;
		}

		return result;
	},
	
	/**
	 * Iterate trough array and return true when <b>all</b> values match
	 *
	 * @param function fn
	 * @param mixed scope
	 * @return boolean
	 */
	every: function ( fn, scope ) {
		
		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}
		
		var length = this.length,
			i = 0;
		
		while ( i < length ) {

			if( fn.call(scope, this[i], i, this) === false ) {

				return false;
			}

			i++;
		}

		return true;
	},
	
	/**
	 * Return new array with modified values
	 *
	 * @param function fn
	 * @param mixed scope
	 * @return boolean
	 */
	map: function ( fn, scope ) {
		
		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}

		var length = this.length,
			result = new Array( length ),
			i = 0;
		
		while ( i < length ) {
			
			if( i in this ) {
				
				result[i] = fn.call(scope, this[i], i, this);
			}

			i++;
		}

		return result;
	},
	
	/**
	 * Iterate trough array and return true when atleast one value matches
	 *
	 * @param function fn
	 * @param mixed scope
	 * @return boolean
	 */
	some: function ( fn, scope ) {
		
		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}
		
		var length = this.length,
			i = 0;
		
		while ( i < length ) {

			if( fn.call(scope, this[i], i, this) === true ) {
				
				return true;
			}

			i++;
		}

		return false;
	},
	
	// Yet to be implented
	reduce: function () {
		
		
	},
	
	reduceRight: function () {
		
		
	}
});

