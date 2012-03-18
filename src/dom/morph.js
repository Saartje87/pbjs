var prefixes = 'Khtml O ms Moz Webkit'.split(' '),
	i = prefixes.length,
	animationName = 'animationName',
	transitionProperty = 'transitionProperty',
	transitionDuration = 'transitionDuration',
	supportsCSSAnimation = animationName in body.style;

while( !supportsCSSAnimation && i-- ) {
	
	if( prefixes[i]+'AnimationName' in body.style ) {
		
		animationName = prefixes[i]+'AnimationName';
		transitionProperty = prefixes[i]+'TransitionProperty',
		transitionDuration = prefixes[i]+'TransitionDuration',
		supportsCSSAnimation = true;
		break;
	}
}

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
	
	PB.each(options.to, function ( key, value ) {
		
		properties += key.replace(/[A-Z]/g, function (m) { return '-'+m.toLowerCase(); })+',';
		
		from[key] = me.getStyle( key ) || 0;	// || 0, tmp fix
	});
	
	properties = properties.substr( 0, properties.length-1 );
	
	from[transitionProperty] = properties;
	from[transitionDuration] = options.duration+'s';
	
	this.setStyle(from);
	
	setTimeout(function() {
		
		me.setStyle(to);
	}, 5);
	
	// e.addEventListener("animationstart", listener, false);  
	//   e.addEventListener("animationend", listener, false);  
	//   e.addEventListener("animationiteration", listener, false);
	
	return this;
};

