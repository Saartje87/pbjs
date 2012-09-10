PB.overwrite(PB.dom, {
	
	/**
	 * Retrieve parent node
	 *
	 * @return <PBDom>
	 */
	parent: function () {
		
		return Dom.get( this.node.parentNode );
	},
	
	/**
	 * Retrieve the first child that is an ELEMENT_NODE
	 *
	 * @return <PBDom>
	 */
	first: function () {
		
		var first = this.node.firstChild;
		
		while( first && first.nodeType !== 1 ) {
			
			first = first.nextSibling;
		}
		
		return first === null
			? null
			: Dom.get(first);
	},
	
	/**
	 * Retrieve the last child that is an ELEMENT_NODE
	 *
	 * @return <PBDom>
	 */
	last: function () {
		
		var last = this.node.lastChild;
		
		while( last && last.nodeType !== 1 ) {
			
			last = last.previousSibling;
		}
		
		return last === null
			? null
			: Dom.get(last);
	},
	
	/**
	 * Retrieve the next sibling that is an ELEMENT_NODE
	 *
	 * @return <PBDom>
	 */
	next: function () {
		
		var sibling = this.node;
		
		while( sibling = sibling.nextSibling ) {
			
			if( sibling.nodeType === 1 ) {
				
				return Dom.get( sibling );
			}
		}
		
		return null;
	},
	
	/**
	 * Retrieve the previous sibling that is an ELEMENT_NODE
	 *
	 * @return <PBDom>
	 */
	prev: function () {
		
		var sibling = this.node;
		
		while( sibling = sibling.previousSibling ) {
			
			if( sibling.nodeType === 1 ) {
				
				return Dom.get( sibling );
			}
		}
		
		return null;
	},
	
	/**
	 * Retrieve childs of the current node
	 *
	 * @return <PBDomCollection>
	 */
	childs: function () {
		
		var childs = new PB.Collection,	// new Collection
			node = this.first();
		
		if( node === null ) {
			
			return childs;
		}
		
		do {
			
			childs.push( node );
		} while ( node = node.next() );
		
		return childs;
	},
	
	/**
	 * Tries to find a matching parent that matches the given expression
	 *
	 * @param string CSS expression
	 * @param number max parents to crawl up
	 * @return <PBDom>
	 */
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
	
	/**
	 * Current node is a descendant of the given element?
	 *
	 * @param string/node/PBDom
	 * @return boolean
	 */
	descendantOf: function ( element ) {
		
		element = Dom.get(element);
		
		return element
			? element.contains( this )
			: false;
	},
	
	/**
	 * Current node contains the given element?
	 *
	 * @param string/node/PBDom
	 * @return boolean
	 */
	contains: function ( element ) {
		
		var node = this.node;
		
		element = Dom.get(element).node;
		
		// Could fail on ie < 9 when using in document
		return node.contains
			? node !== element && node.contains( element )
			: !!(node.compareDocumentPosition( element ) & 16);
	},
	
	/**
	 * Find elements trough CSS expression, searching from within
	 * the current element.
	 *
	 * @param string
	 * @return <PBDomCollection>
	 */
	find: function ( expression ) {
		
		return new PB.Collection( qwery( expression, this.node ).map(Dom.get) );
	}
});

