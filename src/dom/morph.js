// For external modules
PB.browser.supportsCSSAnimation = !!cssPropertyMap['animationName'];

function morphArgs ( args ) {
	
	var options = {
		
		// default duration
		duration: .4
	};
	
	for( var i = 1 ; i < args.length; i++ ) {

		switch( typeof args[i] ) {

			case 'function':
				options.callback = args[i];
				break;

			case 'number':
				options.duration = args[i];
				break;
		}
	}
	
	return options;
}

/**
 * @todo add 'effect' arguments
 */
PB.dom.morph = PB.browser.supportsCSSAnimation ?
function ( to ) {
	
	var me = this,
		from = {},
		properties = '',
		options = morphArgs( arguments );
	
	PB.each(to, function ( key, value ) {
		
		properties += PB.str.camelCase( key )+',';
		from[key] = me.getStyle( key );
	});
	
	// Strip trailing comma
	properties = properties.substr( 0, properties.length-1 );
	
	// Set transition properties
	from.transitionProperty = properties;
	from.transitionDuration = options.duration+'s';
	
	//
	me.once('webkitTransitionEnd oTransitionEnd transitionend', function () {
		
		// Remove transition from element
		me.setStyle({
			
			'transitionProperty': '',
			'transitionDuration': ''
		});
		
		// Trigger callback
		if( options.callback ) {
			
			options.callback( me );
		}
	});
	
	// Set from styles inline
	this.setStyle(from);
	
	// Add to styles for next rendering frame
	// Needed for atleast firefox
	setTimeout(function() {
		
		if( !me.node ) {
			
			return;
		}
		
		me.setStyle(to);
	}, 16.7);
	
} :
// For non supported browsers, just set the style
function ( to ) {
	
	var options = morphArgs( arguments );
	
	this.setStyle(to);
	
	if( options.callback ) {
		
		options.callback( this );
	}
};

