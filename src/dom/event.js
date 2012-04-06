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
	
	supports_mouseenter_mouseleave: 'onmouseenter' in doc.documentElement && 'onmouseleave' in doc.documentElement,
	
	HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	
	MouseEvents: /^(?:click|mouse(?:down|up|over|move|out))$/,

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
	createResponder: function ( uid, type, handler ) {
		
		return function ( event ) {
			
			var cacheEntry = _Event.cache[uid];
			
			event = _Event.extend( event, uid );
			handler.call( cacheEntry.node, event );
		};
	},
	
	/**
	 * Remove all events from element
	 *
	 * Use when removing an element
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
	 * Extend event manualy for browsers that dont support
	 * Event.prototype
	 */
	extend: function ( event, uid ) {
		
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
		
		stopPropagation: function () {
			
			this.cancelBubble = true;
		},
		
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
	 * 
	 */
	on: function ( type, handler ) {
		
		var types = type.split(' ');
		
		// Handle multible events
		if( types.length > 1 ) {
			
			types.forEach(function ( type ) {
				
				this.on( type, handler );
			}, this);
			return this;
		}
		
		var node = this.node,
			uid = node.__PBJS_ID__,
			events = _Event.cache[uid],
			eventsType,
			i;
		
		// Add mouseenter/mouseleave 'type' support...
		if( _Event.supports_mouseenter_mouseleave === false ) {
			
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
			responder: _Event.createResponder( uid, type, handler )
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
	 *
	 */
	once: function ( types, handler ) {
		
		var me = this;
		
		types.split(' ').forEach(function ( type ) {
			
			// Wrapper function
			var _handler = function () {
				
				me.off( type, _handler );
				
				handler.apply( me.node, PB.toArray(arguments) );
			};
			
			// Assign event
			this.on(type, _handler);
		}, this);
		
		return this;
	},
	
	/**
	 *
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
	 *
	 */
	emit: function ( type ) {
		
		var evt;
		
		// Handle html events, see _Event.HTMLEvents
		if( _Event.HTMLEvents.test(type) ) {
			
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

