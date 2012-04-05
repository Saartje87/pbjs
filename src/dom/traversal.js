PB.overwrite(PB.dom, {
	
	parent: function () {
		
		return Dom.get( this.node.parentNode );
	},
	
	first: function () {
		
		var first = this.node.firstChild;
		
		while( first && first.nodeType !== 1 ) {
			
			first = first.nextSibling;
		}
		
		return first === null
			? null
			: Dom.get(first);
	},
	
	last: function () {
		
		var last = this.node.lastChild;
		
		while( last && last.nodeType !== 1 ) {
			
			last = last.previousSibling;
		}
		
		return last === null
			? null
			: Dom.get(last);
	},
	
	next: function () {
		
		var sibling = this.node;
		
		while( sibling = sibling.nextSibling ) {
			
			if( sibling.nodeType === 1 ) {
				
				return Dom.get( sibling );
			}
		}
		
		return null;
	},
	
	prev: function () {
		
		var sibling = this.node;
		
		while( sibling = sibling.previousSibling ) {
			
			if( sibling.nodeType === 1 ) {
				
				return Dom.get( sibling );
			}
		}
		
		return null;
	},
	
	childs: function () {
		
		var childs = new Collection,	// new Collection
			node = this.first();
		
		if( node === null ) {
			
			return childs;
		}
		
		do {
			
			childs.push( node );
		} while ( node = node.next() );
		
		return childs;
	},
		
	closest: function ( expression, maxDepth ) {
		
		var node = this;
		
		maxDepth = maxDepth || 50;
		
		do {
			
			if( qwery.is( node.node, expression ) ) {
				
				return node;
			}
			
			if( !--maxDepth ) {
				
				break;
			}
			
		} while ( node = node.parent() );
		
		return null;
	},
	
	descendantOf: function ( element ) {
		
		element = Dom.get(element);
		
		return element
			? element.contains( this )
			: false;
	},
	
	contains: function ( element ) {
		
		var node = this.node;
		
		element = Dom.get(element).node;
		
		// Could fail on ie < 9 when using in document
		return node.contains
			? node !== element && node.contains( element )
			: !!(node.compareDocumentPosition( element ) & 16);
	},
	
	find: function ( expression ) {
		
		return new Collection( qwery( expression, this.node ).map(Dom.get) );
	}
});

