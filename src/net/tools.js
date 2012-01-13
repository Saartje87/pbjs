PB.overwrite(PB.Net, {
	
	/**
	 * Create uri string
	 *
	 * Should be optimized
	 *
	 * 	Example:
	 * 	{
	 * 		key1: "value1",
	 *		key2: ["val1", "val2", "val"]
	 *	}
	 *
	 *	Output:
	 *	key1=value1&key2[]=val1&key2[]=val2&key2[]=val3
	 */
	buildQueryString: function ( mixed, prefix ) {
		
		var queryString = '';
		
		if( typeof mixed === 'string' ) {
			
			return mixed;
		} else if( Array.isArray(mixed) === true ) {
			
			mixed.forEach(function ( value, key ) {
				
				queryString += typeof value === 'object'
					? PB.Net.buildQueryString( value, (prefix || key)+'[]' )
					: (prefix || key)+"="+encodeURIComponent(value)+'&';
			});
		} else if( typeof mixed === 'object' ) {
			
			Object.keys(mixed).forEach(function ( key ) {
				
				queryString += typeof mixed[key] === 'object'
					? PB.Net.buildQueryString( mixed[key], key+'[]' )
					: (prefix || key)+"="+encodeURIComponent(mixed[key])+'&';
			});
		}
		
		return queryString.replace(/&$/, '');
	}
});

