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
		options = morphArgs( arguments ),
		morph = this.get('__morph') || {};
	
	// Always stop a previous morph
	this.stopMorph();
	
	// Store end styles
	morph.to = to;
	morph.running = true;
	
	PB.each(to, function ( key, value ) {
		
		properties += PB.String.decamelize( key )+',';
		from[key] = me.getStyle( key );
	});
	
	// Strip trailing comma
	properties = properties.substr( 0, properties.length-1 );
	
	// Set transition properties
	from.transitionProperty = properties;
	from.transitionDuration = options.duration+'s';
	
	// Set from styles inline
	this.setStyle(from);

	// Firefox seems to fail when setting the to styles
	// immediately, so add a timer for the next 'css render frame'
	morph.initTimer = setTimeout(function() {
		
		// Element could be removed, check
		if( !me.node ) {
			
			return;
		}
		
		me.setStyle(to);
		
	}, 16.7);
	
	// Timer to trigger callback and reset transition properties
	morph.endTimer = setTimeout(function() {
		
		// Element could be removed, check
		if( !me.node ) {
			
			return;
		}
		
		// Remove transition from element
		me.setStyle({
			
			'transitionProperty': '',
			'transitionDuration': ''
		});
		
		// Trigger callback
		if( options.callback ) {
			
			options.callback( me );
		}

	}, (options.duration*1000)+20);

	this.set('__morph', morph);	
} :
// For non supported browsers, just set the style
function ( to ) {
	
	var options = morphArgs( arguments );
	
	this.setStyle(to);
	
	if( options.callback ) {
		
		options.callback( this );
	}
};

/**
 * Stop morphing
 *
 * @param {boolean} 
 */
PB.dom.stopMorph = function ( skipToEnd ) {
	
	var me = this,
		morph = this.get('__morph') || {};
	
	if( !morph.running ) {
		
		return this;
	}
	
	clearTimeout( morph.initTimer );
	clearTimeout( morph.endTimer );
	
	// Set ending styles
	if( !skipToEnd ) {
	
		// Get current styles and
		PB.each(morph.to, function ( property ) {

			morph.to[property] = me.getStyle(property, true);
		});
	} else {
		
		// Firefox workaround
		PB.each(morph.to, function ( property ) {
			
			me.setStyle(property, '');
		});
	}
	
	morph.to.transitionProperty = '';
	morph.to.transitionDuration = '';
	
	// And again, we need the next renderframe for firefox :( Firefox still animates the
	// the styles after removing transitionProperty and transitionDuration. So therefore we're also
	// resetting the style and after the next renderframe we set the end styles..
	// This could give such very strange results..
	setTimeout(function() {
		
		me.setStyle(morph.to);
		morph.to = void 0;
	}, 16.7);
	
	
//	morph.to = void 0;
	morph.running = false;
	
	return this;
}

