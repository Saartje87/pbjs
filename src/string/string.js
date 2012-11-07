/**
 * pbjs string methods
 */

function camelize ( match, chr ) {
	
	return chr ? chr.toUpperCase() : '';
}

function decamelize ( chr ) {
	
	return '-'+chr.toLowerCase();
}

PB.String = {
	
	/**
	 * Parse string to camelcase string
	 * 
	 * border-color -> borderColor
	 */
	camelize: function ( str ) {
		
		return str.replace(/-+(.)?/g, camelize);
	},
	
	/**
	 * 
	 * 
	 * borderColor -> border-color
	 */
	decamelize: function ( str ) {
		
		return str.replace(/[A-Z]/g, decamelize);
	},
	
	/**
	 * http://simonwillison.net/2006/Jan/20/escape/
	 */
    escapeRegex: function( str ) {
        
		return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
};
/*
'asd-asd'.toCamelCase();

PB.Date('2012');
var name = PB.String.toCamelCase('name-last');
var name = 'name-last'.toCamelCase();
PB.Number(19);

var upperCase = PB.str.camelCase( 's-asdasd' );*/
