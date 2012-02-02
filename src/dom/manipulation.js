PB.overwrite(Dom.prototype, {
	
	/**
	 * Append element to self
	 */
	append: function ( element ) {
		
		if( (element = Dom.get(element)) === null ) {
			
			return null;
		}
		
		this.node.appendChild( element.node );
		
		return this;
	},
	
	/**
	 * Append self to target element
	 */
	appendTo: function ( target ) {
		
		if( (target = Dom.get(target)) === null ) {
			
			return null;
		}
		
		target.append( this );
		
		return this;
	},
	
	/**
	 * Insert self before target element
	 */
	insertBefore: function ( target ) {
		
		if( (target = Dom.get(target)) === null ) {
			
			return null;
		}
		
		target.parent().node.insertBefore( this.node, target.node );
		
		return this;
	},
	
	/**
	 * Insert self after target element
	 */
	insertAfter: function ( target ) {
		
		if( (target = Dom.get(target)) === null ) {
			
			return null;
		}

		var next = target.next();
		
		if( next === null ) {
			
			target.parent().node.appendChild( this.node );
		} else {
			
			target.parent().node.insertBefore( this.node, next.node );
		}
		
		return this;
	},
	
	insertFirst: function ( target ) {
		
		if( (target = Dom.get(target)) === null ) {
			
			return null;
		}
		
		if( target.first() === null ) {
			
			target.append( this );
		} else {
			
			this.insertBefore( target.first() );
		}
		
		return this;
	},
	
	replace: function ( target ) {
		
		if( (target = Dom.get(target)) === null ) {
			
			return null;
		}
		
		this.insertBefore( target );
		
		target.remove();
		
		return this;
	},
	
	clone: function ( deep ) {
		
		var clone = this.node.cloneNode( deep ),
			childs = clone.getElementsByTagName('*'),
			length = childs,
			i = 0;
		
		clone.removeAttribute('id');
		clone.removeAttribute('__PBJS_ID__');
		
		for ( ; i < length; i++) {
			
			childs[i].removeAttribute('id');
			childs[i].removeAttribute('__PBJS_ID__');
		}
		
		return Dom.get(clone);
	},
	
	remove: function () {
		
		var node = this.node,
			pbid = node.__PBJS_ID__,
			morph;

		if( morph = this.get('dom-morph') ) {

			morph.off();
		}

		_Event.purge( node.pbid );

		if( node.parentNode ) {

			node.parentNode.removeChild( node );
		}

		this.node = node = null;
		
		delete cache[pbid];
	},
	
	empty: function () {
		
		this.html('');
		
		// Cleanup cache
		cleanupCache();
		
		return this;
	},
	
	html: function ( html ) {	// Todo: add evalJs boolean
		
		if( typeof html === 'undefined' ) {
			
			return this.node.innerHTML;
		}
		
		this.node.innerHTML = html;
		
		return this;
	}
});

