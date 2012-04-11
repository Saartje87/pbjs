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
	}
});

