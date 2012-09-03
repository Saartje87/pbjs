/**
 * Observer pattern
 *
 * Commonly used pattern in javascript, so we added it to pbjs
 */
PB.Observer = PB.Class({
	
	/**
	 * Initialize observer
	 */
	construct: function () {
		
		// Privates
		this._listeners = {};
		this._context = {};
	},
	
	/**
	 * Attach listener to instance
	 *
	 * @param {String}
	 * @param {Function}
	 * @param {Object} (optional)
	 * @return this
	 */
	on: function ( type, fn, context ) {
		
		if( PB.type(fn) !== 'function' ) {
			
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
	
	/**
	 * Detach listener to instance
	 *
	 * @param {String}
	 * @param {Function} (optional)
	 * @return this
	 */
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
	
	/**
	 * Trigger listeners
	 *
	 * @param {String}
	 * @return this
	 */
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

