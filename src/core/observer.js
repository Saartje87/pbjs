PB.Observer = PB.Class({
	
	construct: function () {
		
		this.listeners = {};
	},
	
	on: function ( type, fn, context ) {
		
		if( !PB.is('Function', fn) ) {
			
			throw new Error('PB.Observer error, fn is not a function');
		}
		
		type.split(' ').forEach(function ( type ) {
			
			if( !this.listeners[type] ) {

				this.listeners[type] = [];
			}

			this.listeners[type].push([fn, context]);
		}, this);
		
		return this;
	},
	
	off: function ( type, fn ) {
		
		if( !fn ) {
			
			this.listeners[type].length = 0;
		}
		
		this.listeners[type].remove(fn);
		
		return this;
	},
	
	emit: function ( type ) {
		
		if( !this.listeners[type] ) {
			
			return this;
		}
		
		var args = slice.call( arguments, 1 );
		
		this.listeners[type].forEach(function ( o ){
			
			// 0 -> function
			// 1 -> scope
			o[0].apply(o[1], args || []);
		});
		
		return this;
	}
});

