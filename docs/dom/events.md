# Events

###on
###once
###off
###emit

***

###Assigning events to element

Note: browser that not support the mouseenter/mouseleave nativly will still respond
event.type with mouseover/mouseout

	var callback = function ( e ) {
		
		switch ( e.type ) {
			
			case 'focus':
				PB(e.currentTarget).
				break;
			
			// Mouseenter
			case 'mouseenter:
			case 'mouseover':
				break;
		}
	};
	
	PB('element_id').on('focus blur mouseenter', callback);

***

###Detaching events from element

	PB('element_id').off('blur', callback);

***

###Dispatch event

	PB('element_id').emit('focus');

