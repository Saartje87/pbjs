function camelCase ( str ) {
	
	return '-'+str.toLowerCase();
}

PB.string = {
	
	camelCase: function ( str ) {
		
		return str.replace(/[A-Z]/g, camelCase);
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
