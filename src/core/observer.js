PB.Observer = PB.Class({
	
	construct: function () {
		
		// Privates
		this._listeners = {};
		this._context = {};
	},
	
	on: function ( type, fn, context ) {
		
		if( !PB.is('Function', fn) ) {
			
			throw new Error('PB.Observer error, fn is not a function');
		}
		
		type.split(' ').forEach(function ( type ) {
			
			// Create new array
			if( !this._listeners[type] ) {

				this._listeners[type] = [];
				this._context[type] = [];
			}
			
			// 
			this._listeners[type].push( fn );
			this._context[type].push( context );
		}, this);
		
		return this;
	},
	
	off: function ( type, fn ) {
		
		var index;
		
		// Nothing set to object
		if( !this._listeners[type] ) {
			
			return;
		}
		
		// Purge all from specific type
		if( !fn ) {
			
			this._listeners[type].length = 0;
		}
		
		index = this._listeners[type].indexOf(fn);
		
		if( index !== -1 ) {
			
			this._listeners[type].splice( index, 1 );
			this._context[type].splice( index, 1 );
		}
		
		return this;
	},
	
	emit: function ( type ) {
		
		if( !this._listeners[type] ) {
			
			return this;
		}
		
		var args = slice.call( arguments, 1 );
		
		this._listeners[type].forEach(function ( fn, index ){
			
			fn.apply( this._context[type][index], args || [] );
		}, this);
		
		return this;
	}
});

