PB.overwrite(PB.dom, {
	
	/**
	 * Check if element has class
	 */
	hasClass: function ( className ) {

		return (new RegExp( "(^|\\s)"+className+"($|\\s)" )).test(this.node.className);
	},
	
	/**
	 * Add class to element
	 */
	addClass: function ( classNames ) {
		
		classNames = classNames.split(' ')
		
		for( var i = 0; i < classNames.length; i++ ) {
			
			// Already exists
			if( this.hasClass(classNames[i]) ) {
			
				continue;
			}
		
			this.node.className += (this.node.className ? ' ' : '')+classNames[i];
		}
		
		return this;
	},
	
	/**
	 * Remove class from element
	 */
	removeClass: function ( classNames ) {
		
		var node = this.node,
			classes = node.className,
			className;
	
		classNames = classNames.split(' ')

		for( var i = 0; i < classNames.length; i++ ) {
			
			className = classNames[i];

			classes = classes.replace( new RegExp( "(^|\\s)"+className+"($|\\s)" ), ' ' );
			classes = classes.trim();
		}	

		// Remove attr
		if( classes === '' ) {

			node.className = null;
		} else {

			node.className = classes;
		}
		
		return this;
	},
	
	/**
	 * 
	 */
	show: function () {
		
		this.node.style.display = this.get('css-display') || 'block';
		
		return this;
	},
	
	hide: function () {
		
		var display = this.getStyle('display');
		
		// Already hidden
		if( display === 'none' ) {
			
			return this;
		}
		
		this.set('css-display', display);
		
		this.node.style.display = 'none';
		
		return this;
	},
	
	isVisible: function () {
		
		return this.getStyle('display') !== 'none' && this.getStyle('opacity') > 0;
	},
	
	getXY: function ( fromBody ) {
		
		// getBoundingClientRect
		
		var node = this.node,
			x = 0,
			y = 0;
			
		while( node ) {
			
			x += node.offsetLeft;
			y += node.offsetTop;
			
			node = node.offsetParent;
			
			if( !node || (!fromBody && Dom.get(node).getStyle('position') !== 'static') ) {

				break;
			}
		}
		
		return {
			
			left: x,
			top: y
		};
	},
	
	getScroll: function () {
		
		var node = this.node,
			scroll = {};
		
		if( node.nodeType === 9 || node === window ) {
			
			scroll.left = Math.max( docElement.scrollLeft, body.scrollLeft );
			scroll.top = Math.max( docElement.scrollTop, body.scrollTop );
		} else {
			
			scroll.left = node.scrollLeft;
			scroll.top = node.scrollTop;
		}
		
		return scroll;
	},
	
	width: function ( value ) {
		
		if( value !== undefined ) {
			
			return this.setStyle('width', value);
		}
		
		var node = this.node;
		
		// Do left and right border
		// 	boxOffset = PB(node).getStyle('boxSizing') === 'border-box' ? PB(node).getStyle('borderLeftWidth') : 0;
		// Add boxOffset to return value..
		
		if( node === window ) {
			
			// different behavior of IE7/8 (undefined)
			return window.innerWidth || docElement.offsetWidth;
		} else if ( node.nodeType === 9 ) {
			
			return Math.max(docElement.clientWidth, body.scrollWidth, docElement.offsetWidth);
		}
		
		if( value = this.getStyle('width', true) && typeof value === 'number' ) {
			
			return value;
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			this.show();
			value = node.offsetWidth;
			this.hide()
		} else {
			
			value = node.offsetWidth;
		}
		
		return value;
	},
	
	innerWidth: function () {
		
		return this.width() + (this.getStyle('paddingLeft', true) || 0) + (this.getStyle('paddingRight', true) || 0);
	},
	
	outerWidth: function () {
		
		return this.width() + (this.getStyle('borderLeftWidth', true) || 0) + (this.getStyle('borderRightWidth', true) || 0);
	},

	scrollWidth: function () {

		return this.node.scrollWidth;
	},
	
	height: function ( value ) {
		
		if( value !== undefined ) {
			
			return this.setStyle('height', value);
		}
		
		var node = this.node;
		
		if( node === window ) {
			
			// different behavior of IE7/8 (undefined)
			return window.innerHeight || docElement.offsetHeight;
		} else if ( node.nodeType === 9 ) {
			
			return Math.max(docElement.clientHeight, body.scrollHeight, docElement.offsetHeight);
		}

		if( value = this.getStyle('height', true) && typeof value === 'number' ) {
			
			return value;
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			// to visibility: hidden?
			this.show();
			value = node.offsetHeight;
			this.hide()
		} else {
			
			value = node.offsetHeight;
		}
		
		return value;
	},
	
	innerHeight: function () {
		
		return this.height() + (this.getStyle('paddingTop', true) || 0) + (this.getStyle('paddingBottom', true) || 0);
	},
	
	outerHeight: function () {
		
		return this.height() + (this.getStyle('borderTopWidth', true) || 0) + (this.getStyle('borderBottomWidth', true) || 0);
	},
	
	scrollHeight: function () {
		
		return this.node.scrollHeight;
	}
});

PB.each({ left: 'Left', top: 'Top' }, function ( lower, upper ) {
	
	PB.dom['scroll'+upper] =  function ( value ) {
		
		if( value !== undefined ) {
			
			var node = this.node;
			
			if( node === win || node === doc || node === docElement ) {
				
				window.scrollTo( lower === 'left' ? value : this.scrollLeft(), lower === 'top' ? value : this.scrollTop() );
			} else {
				
				node['scroll'+upper] = value;
			}
			
			return this;
		}
		
		return this.getScroll()[lower];
	}
	
	PB.dom[lower] = function ( fromBody ) {
		
		if( fromBody !== undefined && fromBody !== true ) {

			this.setStyle(lower, fromBody);

			return this;
		}

		return this.getXY(fromBody)[lower];
	}
});

