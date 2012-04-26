function camelCase ( str ) {
	
	return '-'+str.toLowerCase();
}

PB.str = {
	
	camelCase: function ( str ) {
		
		return str.replace(/[A-Z]/g, camelCase);
	}
};
/*
'asd-asd'.toCamelCase();

PB.Date('2012');
var name = PB.String.toCamelCase('name-last');
var name = 'name-last'.toCamelCase();
PB.Number(19);

var upperCase = PB.str.camelCase( 's-asdasd' );*/
