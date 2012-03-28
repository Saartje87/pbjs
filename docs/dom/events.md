# Events

###Assigning events to element
***

	var callback = function ( e ) {
		
		switch ( e.type ) {
			
			case 'focus':
				PB(e.currentTarget).
				break;
		}
	};
	
	PB('element_id').on('focus blur', callback);


###Detaching events from element

	PB('element_id').off('focus', callback);


###Dispatch event

	PB('element_id').emit('focus');

