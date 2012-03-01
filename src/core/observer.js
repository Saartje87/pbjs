PB.Observer = PB.Class({
	
	construct: function () {
		
		this.listeners = {};
	},
	
	on: function ( type, fn, scope ) {
		
		var types = type.split(' ');
		
		if( types.length > 1 ) {

			types.forEach(function ( type ) {

				this.on( type, fn, scope );
			}, this);
			
			return this;
		}
		
		if( !this.listeners[type] ) {
			
			this.listeners[type] = [];
		}
		
		this.listeners[type].push(fn);
		
		return this;
	},
	
	off: function ( type, fn, scope ) {
		
		this.listeners[type].remove(fn);
	},
	
	emit: function ( type ) {
		
		if( !this.listeners[type] ) {
			
			return;
		}
		
		var args = slice.call( arguments, 1 );
		
		this.listeners[type].forEach(function ( fn ){
			
			fn.apply(null, args || []);
		});
	}
});

