PB.overwrite(PB.dom, {

	/**
	 * Set/get/remove attribute
	 * null values will remove attribute
	 *
	 * @return mixed
	 */
	attr: function ( key, value ) {

		if( PB.is('Object', key) ) {

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

		key = key ? 'data-'+key : key;

		return this.attr( key, value );
	},

	/**
	 * Select the content in the provided range
	 */
	select: function( start, length ) {

		var node = this.node;

	    if ( PB(node).val() ) {

		    if ( !length ){ // default: select all

		        length = ( start ) ? start : PB(node).val().length;
		        start = 0;
		    }

		    if ( node.createTextRange ) {

		        document.selection.empty();

		        var range = node.createTextRange();

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

