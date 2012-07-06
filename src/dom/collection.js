/**
 *
 */
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
	
	/**
	 *
	 */
	toString: function () {
		
		return '[Object PBDomCollection]';
	},
	
	/**
	 *
	 */
	invoke: function () {

		var args = PB.toArray(arguments),
			method = args.shift(),
			col = new Collection(),
			i = 0;

		var pushToCol = function( current ) { col.push( current[method].apply( current, args ) ); };

		for ( ; i < this.length; i++ ){

			if ( PB.type(this[i]) === 'PBDomCollection' ) {
								
				PB.toArray( this[i] ).forEach( pushToCol );

			} else if ( PB.type(this[i]) === 'PBDom' ) {

				col.push( this[i][method].apply( this[i], args ) );
			
			} else {

				this[i][method].apply( this[i], args );
			}
		}

		return (col.length) ? col : this;
	},
	
	/**
	 *
	 */
	push: function ( item ) {
		
		this[this.length++] = item;
		
		return this;
	},
	
	// ec5 shims invoked on Collection
	forEach: Array.prototype.forEach,
	filter: Array.prototype.filter,
	every: Array.prototype.every,
	map: Array.prototype.map,
	some: Array.prototype.some,
	indexOf: Array.prototype.indexOf
};

