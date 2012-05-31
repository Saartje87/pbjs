/**

TODO:
- mouseenter and mouseleave
- Custo events: like element.on('myCustomEvent', function(){});

How its cached:
cache = {

	element.__PBJS_ID__: {
	
		node: node,	// Could be fetched from local.ElementCache
		"click": [],
		"mouseup": [
			{
				handler: fn
				responder: fn
			}
		]
	}
}

 */

var _Event = {
	
	// Mouseenter/mouseleave supported?
	supportsMouseenterMouseleave: 'onmouseenter' in doc.documentElement && 'onmouseleave' in doc.documentElement,
	
	// Event types that should fired trough node.`type`()
	HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	
	// Mouse events, used for emit detection
	MouseEvents: /^(?:click|mouse(?:down|up|over|move|out))$/,
	
	// legacy browsers
	manualExtend: false,
	
	/**
	 * Event cache
	 */
	cache: {},
	
	/**
	 * Create the event wrapper
	 *
	 * @return function
	 */
	createResponder: function ( uid, type, handler, context ) {
		
		return function ( event ) {
			
			var cacheEntry = _Event.cache[uid];
			
			event = _Event.extend( event, uid );
			handler.call( context || cacheEntry.node, event );
		};
	},
	
	/**
	 * Remove all events from target
	 *
	 * Use when removing an element
	 *
	 * @param number
	 * @return void
	 */
	purge: function ( uid ) {
		
		var cache = _Event.cache[uid],
			node,
			keys;
		
		if( !cache ) {
			
			return;
		}
		
		node = cache.node;
		keys = Object.keys(cache);
		
		keys.forEach(function ( type ){
			
			if( type === 'node' ) {
				
				return;
			}
			
			Dom.get(node).off( type );
		});
		
		delete _Event.cache[uid];
		
		node = null;
		
		return;
	},
	
	/**
	 * Extend event object with functionality, on event fire
	 * this function will be called.
	 *
	 * For legacy browsers this also extend the event object with
	 * with de Event specications.
	 *
	 * Returns an extended Event object
	 *
	 * @param Event
	 * @param number
	 * @return Event
	 */
	extend: function ( event, uid ) {
		
		// Easier intergration for touch X/Y
		if( event.type.indexOf('touch') === 0 && event.touches[0] ) {
			
			event.touchX = event.touches[0].pageX;
			event.touchY = event.touches[0].pageY;
		}
		
		// From mootools
		// 	if (type == 'DOMMouseScroll' || type == 'mousewheel')
		// this.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
		
		// No need for extend
		if( _Event.manualExtend === false ) {
			
			return event;
		}
		
		var docEl = doc.documentElement,
			body = doc.body;
		
		PB.overwrite( event, _Event.methods );
		
		// Add related target
		event.target = event.srcElement || _Event.cache[uid].node;
		
		// Add
		event.currentTarget = _Event.cache[uid].node;
		
		// Add relatedTarget if needed
		// Mhh should not be currentTarget right?
		switch ( event.type ) {

			case 'mouseover':
			case 'mouseenter':
				event.relatedTarget = event.fromElement;
				break;
				
			case 'mouseout':
			case 'mouseleave':
				event.relatedTarget = event.toElement;
				break;
		}
		
		if( !event.pageX || !event.pageY ) {
			
			event.pageX = event.clientX + (docEl.scrollLeft || body.scrollLeft) - (docEl.clientLeft || 0);
			event.pageY = event.clientY + (docEl.scrollTop || body.scrollTop) - (docEl.clientTop || 0);
		}
		
		// Which, keyCode
		event.which = event.keyCode === undefined ? event.charCode : event.keyCode;
		
		// Corrent button codes 0 => 1, 4 => 2, 2 => 3
		event.which = (event.which === 0 ? 1 : (event.which === 4 ? 2: (event.which === 2 ? 3 : event.which)));
		
		return event;
	}
};

/**
 *
 */
_Event.methods = {
	
	/**
	 * Short for preventDefault and stopPropagation
	 * 
	 * Tnx prototypejs! :)
	 */
	stop: function () {
		
		this.preventDefault();
	    this.stopPropagation();
	}
};

/**
 * Extend event prototype with DOM level 2 events
 */
if (window.addEventListener) {
	
	PB.overwrite(Event.prototype, _Event.methods);
}

/**
 * Add methods for non DOM level 2 events
 */
if( window.attachEvent && !window.addEventListener ) {
	
	_Event.manualExtend = true;
	
	PB.overwrite(_Event.methods, {
		
		/**
		 * Normalize stopPropagation
		 */
		stopPropagation: function () {
			
			this.cancelBubble = true;
		},
		
		/**
		 * Normalize stopPropagation
		 */
		preventDefault: function () {
			
			this.returnValue = false;
		}
	});
}

/**
 *
 */
PB.overwrite(PB.dom, {
	
	/**
	 * DOM event binding
	 *
	 * Example
	 *	PB('element').on('click', function ( e ){ alert(e.type) })
	 *
	 * @param string
	 * @param Function
	 * @param Object
	 * @return Dom
	 */
	on: function ( type, handler, context ) {
		
		var types = type.split(' ');
		
		// Handle multible events
		if( types.length > 1 ) {
			
			types.forEach(function ( type ) {
				
				this.on( type, handler, context );
			}, this);
			return this;
		}
		
		var node = this.node,
			uid = node.__PBJS_ID__,
			events = _Event.cache[uid],
			eventsType,
			i;
		
		// Rewrite mouseenter/mouseleave to mouseover/mouseover if not supported
		if( _Event.supportsMouseenterMouseleave === false ) {
			
			type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));
		}
		
		// Cache exists for node?
		if( !events ) {
			
			_Event.cache[uid] = events = {node: node};
		}
		
		// Add type to cache
		if( !events[type] ) {
			
			events[type] = [];
		}
		
		eventsType = events[type];
		
		// We don't want to add the same event twice
		i = eventsType.length;
		
		while( i-- ) {
			
			if( eventsType[i].handler === handler ) {
				
				// Event already attached
				return this;
			}
		}
		
		// Create the cache entry
		var entry = {
			
			handler: handler,
			responder: _Event.createResponder( uid, type, handler, context )
		};
		
		eventsType.push( entry );
			
		// Register event to correct listener
		if( node.addEventListener ) {

			node.addEventListener( type, entry.responder, false );
		} else {

			node.attachEvent( 'on'+type, entry.responder );
		}
		
		node = null;
		
		return this;
	},
	
	/**
	 * Bind the event, and removes it after use
	 *
	 * @param string
	 * @param Function
	 * @param Object
	 * @return Dom
	 */
	once: function ( types, handler, context ) {
		
		var me = this;
		
		types.split(' ').forEach(function ( type ) {
			
			// Wrapper function
			var _handler = function () {
				
				me.off( type, _handler );
				
				handler.apply( context || me.node, PB.toArray(arguments) );
			};
			
			// Assign event
			me.on(type, _handler);
		});
		
		return this;
	},
	
	/**
	 * Removes the given: (type + handler) or (type) or (all)
	 * 
	 * @param string
	 * @param Function
	 * @return Dom
	 */
	off: function ( type, handler ) {
		
		var node = this.node,
			uid = node.__PBJS_ID__,
			events = _Event.cache[uid],
			eventsType,
			entry,
			i;
		
		// Nothing to remove
		if( !events ) {
			
			return this;
		}
		
		// 
		if( !type ) {
			
			// Purge all events
			_Event.purge( uid );
			return this;
		}
		
		eventsType = events[type];
		
		if( !eventsType ) {
			
			return this;
		}
		
		i = eventsType.length;
		
		if( !handler ) {
			
			// Loop trough storage and remove all with type
			while( i-- ) {
				
				this.off( type, eventsType[i].handler );
			}
			
			return this;
		}
		
		// Find entry
		while( i-- ) {
			
			if( eventsType[i].handler === handler ) {
				
				entry = eventsType[i];
				eventsType.splice( i, 1 );
				
				if( !eventsType.length ) {
					
					delete _Event.cache[uid][type];
				}
				break;
			}
		}
		
		// No entry found
		if( !entry ) {
			
			return this;
		}
		
		if( node.removeEventListener ) {
			
			node.removeEventListener( type, entry.responder, false );
		} else {
			
			node.detachEvent( 'on'+type, entry.responder );
		}
		
		node = null;
		
		return this;
	},
	
	/**
	 * Dispatch the event on the element
	 *
	 * @param string
	 * @return Dom
	 */
	emit: function ( type ) {
		
		var evt;
		
		// Handle html events, see _Event.HTMLEvents
		// Trigger direct trough node method for HTMLEvents and INPUT type
		// Input check is done for FireFox, failes to trigger input[type=file] with click event
		if( _Event.HTMLEvents.test(type) || this.nodeName === 'INPUT' ) {
			
			this.node[type]();
		}
		// Handle W3C mouse event type
		else if( document.createEvent ) {
			
			if ( _Event.MouseEvents.test(type) ) {
				
				evt = document.createEvent('MouseEvents');

				evt.initMouseEvent(
					type, true, true, window,		// type, canBubble, cancelable, view, 
					0, 0, 0, 0, 0,					// detail, screenX, screenY, clientX, clientY, 
					false, false, false, false,		// ctrlKey, altKey, shiftKey, metaKey, 
					0, null);						// button, relatedTarget

				this.node.dispatchEvent(evt);
			} else {
				
				evt = document.createEvent('Events');
				
				evt.initEvent( type, true, true );

				this.node.dispatchEvent(evt);
			}
		}
		// IE <= 8
		else {
			
			var _event = document.createEventObject();
			this.node.fireEvent('on'+type, _event);
		}
		
		return this;
	}
});

