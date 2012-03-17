PB.overwrite(Dom.prototype, {
	
	set: function ( key, value ) {
		
		this.storage[key] = value;
		
		return this;
	},
		
	get: function ( key ) {

		var value = this.storage[key];

		return value !== undefined
			? value
			: undefined;
	},
	
	unset: function ( key ) {
		
		return delete this.storage[key];
	}
});

