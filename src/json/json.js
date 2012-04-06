context.JSON || (context.JSON = {});

PB.extend(context.JSON, {
	
	stringify: function ( mixed ) {
		
		var jsonString = '',
			key,
			length;
		
		switch( toString.call(mixed) ) {
			
			case '[object Number]':
				jsonString += mixed;
				break;

			case '[object String]':
				jsonString += '"'+mixed+'"';
				break;

			case '[object Array]':
				jsonString += '[';
				
				for( key = 0, length = mixed.length; key < length; key++) {
					
					jsonString += JSON.stringify( mixed[key] )+', ';
				}
				
				jsonString = jsonString.trimRight(', ')+']';
				break;

			case '[object Object]':
				jsonString += '{';
			
				for( key in mixed ) {
					
					if( mixed.hasOwnProperty(key) ) {
						
						jsonString += '"'+key+'": '+JSON.stringify( mixed[key] )+', ';
					}
				}
				
				jsonString = jsonString.trimRight(', ')+'}';
				break;
			
			default:
				jsonString += 'null';
				break;
		}
		
		return jsonString;
	},
	
	parse: function ( text ) {
		
		// Do not allow functions
		if( /:[\t\s\n]*function/.test( text ) ) {
			
			return null;
		}
		
		return eval('('+text+')');
	}
});