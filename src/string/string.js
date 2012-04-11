function camelCase ( str ) {
	
	return '-'+str.toLowerCase();
}

PB.str = {
	
	camelCase: function ( str ) {
		
		return str.replace(/[A-Z]/g, camelCase);
	}
};

