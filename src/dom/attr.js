PB.overwrite(PB.dom, {

	/**
	 * Set/get/remove attribute
	 * null values will remove attribute
	 *
	 * @return mixed
	 */
	attr: function ( key, value ) {

		if( PB.type(key) === 'object' ) {

			PB.each(key, this.attr, this);
			return this;
		}

		if( value === undefined ) {

			return this.node.getAttribute(key);
		} else if ( value === null ) {

			this.node.removeAttribute(key);
		} else {

			this.node.setAttribute(key, value);
		}

		return this;
	},

	/**
	 * Set / get value from form element
	 */
	val: function ( value ) {

		if( value === undefined ) {

			return this.node.value;
		}

		this.node.value = value;

		return this;
	},

	/**
	 * Set or retrieve 'data-' attribute
	 */
	data: function ( key, value ) {

		return this.attr( 'data-'+key, value );
	},

	/**
	 * Select the content in the provided range
	 */
	select: function( start, length ) {

		var node = this.node,
			value = this.val(),
			range;

	    if ( value ) {

		    if ( !length ){ // default: select all

		        length = ( start ) ? start : value.length;
		        start = 0;
		    }

		    if ( node.createTextRange ) {

		        document.selection.empty();

		        range = node.createTextRange();

		        range.collapse( true );

		        range.moveStart( 'character', start );
		        range.moveEnd( 'character', start + length );
		        range.select();

		    } else {

		        window.getSelection().removeAllRanges();
			    node.setSelectionRange( start, start+length );
		    }
	    }
	}

});

