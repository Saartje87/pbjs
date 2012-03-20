var div = document.createElement('div'),
	prefixes = 'Khtml O ms Moz Webkit'.split(' '),
	i = prefixes.length,
	animationName = 'animationName',
	transitionProperty = 'transitionProperty',
	transitionDuration = 'transitionDuration',
	supportsCSSAnimation = animationName in div.style;

while( !supportsCSSAnimation && i-- ) {
	
	if( prefixes[i]+'AnimationName' in div.style ) {
		
		animationName = prefixes[i]+'AnimationName';
		transitionProperty = prefixes[i]+'TransitionProperty';
		transitionDuration = prefixes[i]+'TransitionDuration';
		supportsCSSAnimation = true;
		break;
	}
}

// For external modules
Dom.supportsCSSAnimation = supportsCSSAnimation;

Dom.prototype.morph = function ( to/* after, duration, effect */ ) {
	
	// No animation supported, set directly to end styles
	if( !supportsCSSAnimation ) {
		
		return this.setStyle(to);
	}
	
	var options = {
			
			to: to,
			duration: .4	// Default duraton
		},
		i = 1,
		from = {},
		properties = '',
		me = this;

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

	// Wtf, this all fails, on all browsers...
	// if( options.after ) {
	// 	
	// 	this.once('webkitAnimationEnd', options.after);
	// 	this.once('mozAnimationEnd', options.after);
	// 	this.once('animationEnd', options.after);
	// 	this.once('animationend', options.after);
	// 	this.once('mozanimationend', options.after);
	// }
	
	PB.each(options.to, function ( key, value ) {
		
		properties += key.replace(/[A-Z]/g, function (m) { return '-'+m.toLowerCase(); })+',';
		
		from[key] = me.getStyle( key ) || 0;	// || 0, tmp fix
	});
	
	properties = properties.substr( 0, properties.length-1 );
	
	from[transitionProperty] = properties;
	from[transitionDuration] = options.duration+'s';
	
	this.setStyle( from );
	
	// Add to styles for next rendering frame
	setTimeout(function() {
		
		me.setStyle(to);
	}, 16.67);
	
	// e.addEventListener("animationstart", listener, false);  
	//   e.addEventListener("animationend", listener, false);  
	//   e.addEventListener("animationiteration", listener, false);
	
	return this;
};

