/**
 * Prototype of pb class system
 * @todo: parent, proto as PB.Class args
 */
PB.Class = function ( proto ) {
	
	var extend = PB.Class.extend,
		constructor = proto.constructor,
		_parent = proto.__extends,
		klass = proto.constructor = proto.__pb__construct = function () {
		
			// When proto has no constructor and parent class has
			if( proto.hasOwnProperty('constructor') === false && _parent && _parent.prototype.__pb__construct ) {
			
				_parent.prototype.__pb__construct.apply( this, arguments );
				return;
			} else if ( _parent ) { // Add wrapper for constructor with ref to parent
			
				var _constructor = constructor;
			
				constructor = function () {
				
					this.parent = _parent.prototype.__pb__construct;
				
					_constructor.apply( this, arguments );
				
					delete this.parent;
				};
			}
			
			// Exec constructor
			constructor.apply( this, arguments );
		};
	
	if( _parent ) {
		
		klass.prototype = PB.overwrite( {}, _parent.prototype );
		
		delete proto.__extends;
	}
	
	for( var key in proto ) {
		
		extend.call( klass.prototype, key, proto[key] );
	}
	
	return klass;
};

/**
 * Extend PB.Class object with key, method
 * 
 * Add wrapper if function already defined with
 * ref to parent
 */
PB.Class.extend = function ( key, method ) {
	
	var ancestor = this[key];
	
	if( typeof ancestor === 'function' ) {
		
		var _method = method;
		
		method = function () {
			
			this.parent = ancestor;
					
			return _method.apply( this, arguments );
		}
	}
	
	this[key] = method;
};

