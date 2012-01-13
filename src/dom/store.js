PB.overwrite(Dom.prototype, {
	
	set: function ( key, value ) {
		
		this.storage[key] = value;
		
		return this;
	},
	
	get: function ( key ) {
		
		return this.storage[key] || null;
	},
	
	unset: function ( key ) {
		
		return delete this.storage[key];
	}
});

