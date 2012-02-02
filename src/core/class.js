PB.Class = function ( _parent, base ) {

	if( !base ) {

		base = _parent;
		_parent = null;
	}

	var constructor = base.construct,
		klass = function () {

			if( _parent !== null ) {

				if( !constructor ) {
					
					constructor = _parent.prototype.construct;
				} else {
					
					var _constructor = constructor;

					constructor = function () {

						var __parent = this.parent;

						this.parent = _parent.prototype.construct;

						_constructor.apply( this, arguments );

						this.parent = __parent;
					};
				}
			}
			
			if( typeof constructor === 'function' ) {
				
				constructor.apply( this, arguments );
			}
		};

	if( _parent !== null ) {

		klass.prototype = PB.overwrite( {}, _parent.prototype );
	}

	PB.each(base, PB.Class.extend, klass.prototype);

	return klass;
};

PB.Class.extend = function ( key, method ) {

	var ancestor = this[key],
		_method;

	if( typeof ancestor === 'function' ) {

		_method = method;

		method = function () {

			var _parent = this.parent,
				result;

			this.parent = ancestor;

		 	result = _method.apply( this, arguments );

			this.parent = _parent;

			return result;
		}
	}

	this[key] = method;
};

