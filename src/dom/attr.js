PB.overwrite(Dom.prototype, {
	
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
		
		var node = this.node;
		
		if( value === undefined ) {
			
			return node.getAttribute(key);
		} else if ( value === null ) {
			
			node.removeAttribute(key);
		} else {
			
			node.setAttribute(key, value);
		}
		
		return this;
	},
	
	/**
	 * Set / get value from form element
	 */
	val: function ( value ) {
		
		var node = this.node;
		
		if( value === undefined ) {
			
			return node.value;
		}
		
		node.value = value;
		
		return this;
	}
});

