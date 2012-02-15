PB.overwrite(Dom.prototype, {
	
	parent: function () {
		
		return Dom.get( this.node.parentNode );
	},
	
	first: function () {
		
		var first = this.node.firstChild;
		
		do {
			
			if( first && first.nodeType === 1 ) {
				
				return Dom.get( first );
			}
			
		} while( first = first.nextSibling );
		
		return null;
	},
	
	last: function () {
		
		var last = this.node.lastChild;
		
		do {
			
			if( last.nodeType === 1 ) {

				return Dom.get( last );
			}
		} while ( last = last.previousSibling );
		
		return null;
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
	
	match: function ( expression ) {
		
		// div[attr=blep]
		
		var matchNode = expression.match(/^\w+/),
			matchClassNames = expression.match(/\.([a-zA-Z0-9-_]+)/g),
			match = false;
		
		if( matchNode && matchNode[0].toUpperCase() === this.nodeName) {
			
			match = true;
		}
		
		if( matchClassNames ) {
			
			var i = matchClassNames.length;
			
			while( i-- ) {
				
				match = this.hasClass( matchClassNames[i].replace('.', '') );
				
				if( !match ){
					
					break;
				}
			}
		}
		
		return match;
	},
	
	closest: function ( expression, maxDepth ) {
		
		var node = this;
		
		maxDepth = maxDepth || 50;
		
		do {
			
			if( node.match(expression) ) {
				
				return node;
			}
			
			if( !--maxDepth ) {
				
				break;
			}
			
		} while ( node = node.parent() );
		
		return null;
	},
	
	descendantOf: function ( element, maxDepth ) {
		
		var node = this.node;

		element = Dom.get(element).node;
		maxDepth = maxDepth || 50;
		
		do {
			
			if( node === element ) {

				return true;
			}

			if( !--maxDepth ) {

				break;
			}
		} while( node = node.parentNode );

		return false;
	},
	
	find: function ( expression ) {
		
		if( body.querySelectorAll ) {
			
			return new Collection( PB.toArray( this.node.querySelectorAll( expression ) ).map(Dom.get) );
		}
		
		// Maybe handle 'older' browsers with an require() of sizzle..
		
		alert('Find not yet implented for this browser');
	}
});

