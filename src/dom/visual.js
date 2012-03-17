var domClassCache = {},
	boxModel = false,
	substractBorder = false;
	
(function support (){
	
	if( !doc.body ) {
		
		return window.setTimeout(support, 10);
	}
	
	body = doc.body;
	
	var testElement = document.createElement('div');
	
	body.appendChild(testElement);
	
	// Set width and padding to see if browsers acts like W3C box model
	testElement.style.width = testElement.style.paddingLeft = '1px';

	boxModel = (testElement.offsetWidth === 2);
	
	// When culculating width/height remove border if calculated with offsetWidth/offsetHeight
	testElement.style.borderLeft = '1px solid #000';

	substractBorder = (testElement.offsetWidth === 3);

	// Cleanup DOM
	body.removeChild( testElement );
	testElement = null;
})();

PB.overwrite(Dom.prototype, {
	
	/**
	 * Check if element has class
	 */
	hasClass: function ( className ) {
		
		var regexp = domClassCache[className];
		
		if( !regexp ) {
			
			regexp = domClassCache[className] = new RegExp( "(^|\\s)"+className+"($|\\s)" );
		}
		
		return regexp.test(this.node.className);
	},
	
	/**
	 * Add class to element
	 */
	addClass: function ( className ) {
		
		// Already exists
		if( this.hasClass(className) ) {
			
			return this;
		}
		
		this.node.className += (this.node.className ? ' ' : '')+className;
		
		return this;
	},
	
	/**
	 * Remove class from element
	 */
	removeClass: function ( className ) {
		
		var node = this.node,
			classes = node.className,
			regexp = domClassCache[className];

		if( !regexp ) {

			regexp = domClassCache[className] = new RegExp( "(^|\\s)"+className+"($|\\s)" );
		}
		
		classes = classes.replace( regexp, ' ' );
		classes = classes.trim();
		
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
		
		this.unset('css-display');
		
		return this;
	},
	
	hide: function () {
		
		// Should be trough getStyle
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
		
		return this.getStyle('display') !== 'none';
	},
	
	width: function ( width ) {
		
		if( width !== undefined ) {
			
			return this.setStyle('width', width);
		}
		
		var node = this.node,
			width;
		
		if( node === window ) {
			
			return window.innerWidth;
		} else if ( node.nodeType === 9 ) {
			
			return Math.max(docElement.clientWidth, body.scrollWidth, docElement.offsetWidth);
		}
		
		width = this.getStyle('width');
		
		if( width > 0 ) {
			
			return width;
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			this.show();
			width = node.offsetWidth;
			this.hide()
		} else {
			
			width = node.offsetWidth;
		}
		
		if( boxModel ) {
			
			width -= (this.getStyle('paddingLeft') || 0) + (this.getStyle('paddingRight') || 0);
		}
		
		// Some browsers add border to offsetWidth, we remove it:)
		if( substractBorder ) {
			
			width -= (this.getStyle('borderLeftWidth') || 0) + (this.getStyle('borderRightWidth') || 0);
		}
		
		return width;
	},
	
	innerWidth: function () {
		
		return this.width() + (this.getStyle('paddingLeft') || 0) + (this.getStyle('paddingRight') || 0);
	},
	
	outerWidth: function () {
			
		var rightWidth = this.getStyle('borderRightWidth');
		
		return this.innerWidth() + (this.node.clientLeft + (typeof rightWidth === 'string' ? 0 : rightWidth));
	},

	scrollWidth: function () {

		return this.node.scrollWidth;
	},
	
	height: function ( height ) {
		
		if( height !== undefined ) {
			
			return this.setStyle('height', height);
		}
		
		var node = this.node,
			height;
		
		if( node === window ) {
			
			return window.innerHeight;
		} else if ( node.nodeType === 9 ) {
			
			return Math.max(docElement.clientHeight, body.scrollHeight, docElement.offsetHeight);
		}
		
		height = this.getStyle('height');
		
		if( height > 0 ) {
			
			return height;
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			this.show();
			height = node.offsetHeight;
			this.hide()
		} else {
			
			height = node.offsetHeight;
		}
		
		if( boxModel ) {
			
			height -= (this.getStyle('paddingTop') || 0) + (this.getStyle('paddingBottom') || 0);
		}
		
		// Some browsers add border to offsetHeight, we remove it:)
		if( substractBorder ) {
			
			height -= (this.getStyle('borderTopWidth') || 0) + (this.getStyle('borderBottomWidth') || 0);
		}
		
		return height;
	},
	
	innerHeight: function () {
		
		return this.height() + (this.getStyle('paddingTop') || 0) + (this.getStyle('paddingBottom') || 0);
	},
	
	outerHeight: function () {
			
		var bottomWidth = this.getStyle('borderBottomWidth');
		
		return this.innerHeight() + (this.node.clientTop + (typeof bottomWidth === 'string' ? 0 : bottomWidth));
	},
	
	scrollHeight: function () {
		
		return this.node.scrollHeight;
	},
	
	getXY: function ( fromBody ) {
		
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
	
	left: function ( fromBody ) {
		
		if( fromBody && fromBody !== true ) {
			
			this.setStyle('left', fromBody);
			
			return this;
		}
		
		return this.getXY(fromBody).left;
	},
	
	top: function ( fromBody ) {
		
		if( fromBody && fromBody !== true ) {
			
			this.setStyle('top', fromBody);
			
			return this;
		}
		
		return this.getXY(fromBody).top;
	},
	
	getScroll: function () {
		
		var node = this.node,
			scroll = {};
		
		if( node.nodeType === 9 || node === window ) {
			
			scroll.left = docElement.scrollLeft;	// || body.scrollLeft;
			scroll.top = docElement.scrollTop;		// || body.scrollTop;
		} else {
			
			scroll.left = node.scrollLeft;
			scroll.top = node.scrollTop;
		}
		
		return scroll;
	},
	
	scrollLeft: function ( x ) {
		
		if( x === undefined ) {
			
			return this.getScroll().left;
		}
		
		var node = this.node;
		
		if( node.nodeType === 9 || node === window ) {
			
			docElement.scrollLeft = x;
		} else {
			
			node.scrollLeft = x;
		}
		
		return this;
	},
	
	scrollTop: function ( y ) {
		
		if( y === undefined ) {
			
			return this.getScroll().top;
		}
		
		var node = this.node;
		
		if( node.nodeType === 9 || node === window ) {
			
			docElement.scrollTop = y;
		} else {
			
			node.scrollTop = y;
		}
		
		return this;
	}
});

