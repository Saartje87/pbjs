PB.overwrite(PB.dom, {
	
	set: function ( key, value ) {
		
		this.storage[key] = value;
		
		return this;
	},
		
	get: function ( key ) {

		return this.storage[key];
	},
	
	unset: function ( key ) {
		
		return delete this.storage[key];
	},
	
	isset: function ( key ) {
		
		return this.storage[key] !== undefined;
	}
});

