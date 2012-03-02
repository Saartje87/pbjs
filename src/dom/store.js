PB.overwrite(Dom.prototype, {
	
	set: function ( key, value ) {
		
		this.storage[key] = value;
		
		return this;
	},
		
	get: function ( key ) {

		var value = this.storage[key];

		return typeof value !== 'undefined'
			? value
			: null;
	},
	
	unset: function ( key ) {
		
		return delete this.storage[key];
	}
});

