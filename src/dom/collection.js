var Collection = PB.Collection = function ( collection ) {
	
	var i = 0;

	if( !collection ) {
		
		this.length = 0;
		return;
	}
	
	this.length = collection.length;
	
	for( ; i < this.length; i++ ) {
		
		this[i] = collection[i];
	}
};

Collection.prototype = {
	
	toString: function () {
		
		return '[Object DomCollection]';
	},
	
	invoke: function () {
		
		var args = PB.toArray(arguments),
			method = args.shift(),
			i = 0;
		
		for ( ; i < this.length; i++ ){
		
			this[i][method].apply( this[i], args );
		}
		
		return this;
	},
	
	push: function ( item ) {
		
		this[this.length++] = item;
		
		return this;
	},
	
	forEach: Array.prototype.forEach,
	filter: Array.prototype.filter,
	every: Array.prototype.every,
	map: Array.prototype.map,
	some: Array.prototype.some,
	indexOf: Array.prototype.indexOf
};

