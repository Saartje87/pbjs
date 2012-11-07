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
		
		var query = '',
			isArray = false;
		
		if( !mixed ) {
			
			return mixed;
		}
		
		if( PB.is('Object', mixed) || (isArray = PB.is('Array', mixed)) ) {
			
			PB.each(mixed, function ( key, value ) {
				
				if( typeof value === 'object' && value !== null ) {
					
					query += PB.Net.buildQueryString( value, prefix ? prefix+'['+key+']' : key );
				} else {
					
					// Add key, if object add prefix[key] if array prefix[]
					query += prefix
						? prefix+(isArray ? '[]' : '['+key+']')
						: key;
				
					query += '='+encodeURIComponent( value )+'&';
				}
			});
		} else {
			
			query = String(mixed);
			query = encodeURIComponent(query);
		}
		
		return prefix ? query : query.replace(/&$/, '');
	},
	
	/**
	 * Make object from query part of url
	 *
	 * @return object
	 */
	parseQueryString: function( str ) {
		
		var parts = {},
			part;
		
		str = str.indexOf('?') !== -1 ? str.substr( str.indexOf('?') + 1 ) : str;
		
		str.split('&').forEach(function ( entry ) {
			
			part = entry.split('=');
			
			parts[decodeURIComponent(part[0])] = decodeURIComponent(part[1]);
		});
		
		return parts;
    }
});

