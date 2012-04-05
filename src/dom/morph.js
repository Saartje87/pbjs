var div = document.createElement('div'),
	prefixes = 'Khtml O ms Moz Webkit'.split(' '),
	i = prefixes.length,
//	animationName = 'animationName',
	transitionProperty = 'transitionProperty',
	transitionDuration = 'transitionDuration',
	supportsCSSAnimation = 'animationName' in div.style;

while( !supportsCSSAnimation && i-- ) {

	if( prefixes[i]+'AnimationName' in div.style ) {

//		animationName = prefixes[i]+'AnimationName';
		transitionProperty = prefixes[i]+'TransitionProperty';
		transitionDuration = prefixes[i]+'TransitionDuration';
		supportsCSSAnimation = true;
		break;
	}
}

div = null;

// For external modules
Dom.supportsCSSAnimation = supportsCSSAnimation;

PB.dom.morph = function ( to/* after, duration, effect */ ) {

	var options = {

			to: to,
			duration: .4	// Default duraton
		},
		i = 1,
		from = {},
		properties = '',
		me = this,
		after;

	for( ; i < arguments.length; i++ ) {

		switch( typeof arguments[i] ) {

			case 'function':
				options.after = arguments[i];
				break;

			case 'number':
				options.duration = arguments[i];
				break;
			//
			// case 'string':
			// 	options.effect = arguments[i];
			// 	break;
		}
	}
	
	// No animation supported, set the styles..
	if( !supportsCSSAnimation ) {

		this.setStyle(to);
		
		if( options.after ) {

			options.after( this );
		}
		
		return this;
	}

	PB.each(options.to, function ( key, value ) {

		properties += key.replace(/[A-Z]/g, function (m) { return '-'+m.toLowerCase(); })+',';

		from[key] = me.getStyle( key ) || 0;	// || 0, tmp fix
	});

	properties = properties.substr( 0, properties.length-1 );
	
	// Basic implementation to cleanup animation styles
	after = function ( element ) {
		
		element.setStyle(from);
		element.setStyle(to);
		
		!options.after || options.after( element );
		
		from = to = null;
	}

	if( options.after ) {
		
		me.once('webkitTransitionEnd oTransitionEnd transitionend', after.bind( null, this ));
	}
	
	from[transitionProperty] = properties;
	from[transitionDuration] = options.duration+'s';

	this.setStyle( from );
	
	// Clear reference
	from[transitionProperty] = '';
	from[transitionDuration] = '';

	// Add to styles for next rendering frame
	setTimeout(function() {

		me.setStyle(to);
	}, 16.7);

	return this;
};

