// Deprecated since 0.5.10, use PB.support.CSSTransition
PB.browser.supportsCSSAnimation = !!cssPropertyMap['animationName'];

function morphArgs ( args ) {
	
	var options = {
		
		// default duration
		duration: .4,
		effect: 'ease'
	};
	
	for( var i = 1 ; i < args.length; i++ ) {

		switch( typeof args[i] ) {
			
			case 'function':
				options.callback = args[i];
				break;

			case 'number':
				options.duration = args[i];
				break;
		
			case 'string':
				options.effect = PB.String.decamelize(args[i]);
				break;
		}
	}
	
	return options;
}

/**
 * @todo add 'effect' arguments
 *
 * Firefox bug, https://bugzilla.mozilla.org/show_bug.cgi?id=604074
 */
PB.dom.morph = PB.support.CSSTransition ?
function ( to ) {
	
	var me = this,
		options = morphArgs( arguments ),
		morph = this.get('__morph') || {},
		from = {};
	
	// Stop the current animation, if any..
	if( morph.running ) {
		
		// Stop animation at current point but do not trigger callback
		this.stop(false, true);
	}
	
	// Store end styles
	morph.to = to;
	morph.callback = options.callback;
	morph.running = true;
	
	// Set transition property, will `all` be a safe value?
	from.transition = 'all '+options.duration+'s '+options.effect;
	
	// Calculate current styles
	PB.each(to, function ( property ) {
		
		from[property] = me.getStyle( property, true );
	});
	
	// Set the current styles inline
	this.setStyle(from);
	
	// Force computation, removes the need for timers..
	PB.each(to, function ( property ) {
		
		me.getStyle( property, true );
	});
	
	/* Example code to force `GPU`
	if( to.left && to.top && !to.transform ) {
		
		to.transform = 'translate('+addUnits('left', to.left)+', '+addUnits('top', to.top)+')';
		delete to.left;
		delete to.top;
	}
	*/
	
	// Start the animation :D
	me.setStyle(to);
	
	// Timer to trigger callback and reset transition properties
	morph.endTimer = setTimeout(function() {
		
		// Element could be removed, check
		if( !me.node ) {
			
			return;
		}
		
		morph.running = false;
		
		// Remove transition from element
		me.setStyle({
			
			transition: ''
		});
		
		// Trigger callback
		if( options.callback ) {
			
			options.callback( me );
		}

	}, (options.duration*1000));

	// Store morph
	this.set('__morph', morph);
	
	return this;
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
 * @param {boolean} (optional)
 * @param {boolean} (optional)
 * @return this
 */
PB.dom.stop = function ( skipToEnd, triggerCallback ) {
	
	var me = this,
		morph = this.get('__morph');
	
	if( !morph || !morph.running ) {
		
		return this;
	}
	
	triggerCallback = (triggerCallback === undefined) ? true : !!triggerCallback;
	
	// Not running anymore
	morph.running = false;
	
	// Clear the callback
	clearTimeout( morph.endTimer );
	
	// Set ending styles
	if( skipToEnd ) {
		
		// Trigger manual computation, removes the need for a timer..
		PB.each(morph.to, function ( property ) {
			
			me.setStyle(property, '');
			me.getStyle(property, true);
		});
	}
	// Stop animation on current position
	else {
		
		// Compute current styles
		PB.each(morph.to, function ( property ) {

			morph.to[property] = me.getStyle(property, true);
		});
	}
	
	// Clear transition
	morph.to.transition = '';
	
//	this.getStyle('transition', true);
	
	// Set styles
	this.setStyle(morph.to);
	
	if( triggerCallback && morph.callback ) {
		
		morph.callback( this );
	}
	
	return this;
}

