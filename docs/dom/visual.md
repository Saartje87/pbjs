# Attribute

###hasClass

	if( PB('element_id').hasClass('foo') ) {
		
		// Has class foo
	}

***

###addClass

	B('element_id').addClass('foo');

***

###removeClass

	PB('element_id').removeClass('foo');

***

###show

	PB('element_id').show();

***

###hide

	PB('element_id').hide();

***

###isVisible

	if( PB('element_id').isVisible() ) {
		
		// Its visible
	}

***

###width

Get width

	PB('element_id').width();

Set width

	PB('element_id').width( 20 );

***

###innerWidth

Element width + padding

	PB('element_id').innerWidth();

***

###outerWidth

Element width + padding + border

	PB('element_id').outerWidth();

***

###scrollWidth

	PB('element_id').outerWidth();

***

###height

Get height

	PB('element_id').height();

Set height

	PB('element_id').height( 20 );

***

###innerHeight

Element height + padding

	PB('element_id').innerHeight();

***

###outerHeight

Element height + padding + border

	PB('element_id').outerHeight();

***

###scrollHeight

	PB('element_id').scrollHeight();

***

###getXY

Offset from offsetParent

	PB('element_id').getXY();

Offset from body

	PB('element_id').getXY( true );

***

###left

Get left

	PB('element_id').left();

Set left

	PB('element_id').left( 20 );

***

###top

Get top

	PB('element_id').top();

Set top

	PB('element_id').top( 20 );

***

###getScroll

Get left/top scroll

	PB('element_id').getScroll();

***

###scrollLeft

	PB('element_id').scrollLeft();
	PB('element_id').scrollLeft( 20 );

***

###scrollTop

	PB('element_id').scrollTop();
	PB('element_id').scrollTop( 20 );
