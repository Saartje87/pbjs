PB.Observer = PB.Class({
	
	construct: function () {
		
		this.listeners = {};
	},
	
	on: function ( type, fn, scope ) {
		
		type.split(' ').forEach(function ( type ) {
			
			if( !this.listeners[type] ) {

				this.listeners[type] = [];
			}

			this.listeners[type].push(fn);
		}, this);
		
		return this;
	},
	
	off: function ( type, fn, scope ) {
		
		this.listeners[type].remove(fn);
	},
	
	emit: function ( type ) {
		
		if( !this.listeners[type] ) {
			
			return this;
		}
		
		var args = slice.call( arguments, 1 );
		
		this.listeners[type].forEach(function ( fn ){
			
			fn.apply(null, args || []);
		});
		
		return this;
	}
});

