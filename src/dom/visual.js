var domClassCache = {},
	boxModel = false,
	substractBorder = false;

PB.ready(function (){
	
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
});

PB.overwrite(PB.dom, {
	
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
	addClass: function ( classNames ) {
		
		classNames = classNames.split(' ')
		
		for( var i = 0; i < classNames.length; i++ ) {
			
			// Already exists
			if( this.hasClass(classNames[i]) ) {
			
				return this;
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
			regexp,
			className;
	
		classNames = classNames.split(' ')

		for( var i = 0; i < classNames.length; i++ ) {
			
			className = classNames[i];
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
		}
		
		return this;
	},
	
	/**
	 * 
	 */
	show: function () {
		
		// Not needed I guess
		// if( this.getStyle('display') !== 'none' ) {
		// 	
		// 	return this;
		// }
		
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
		
		if( node === window ) {
			
			// different behavior of IE7/8 (undefined)
			return window.innerWidth || docElement.offsetWidth;
		} else if ( node.nodeType === 9 ) {
			
			return Math.max(docElement.clientWidth, body.scrollWidth, docElement.offsetWidth);
		}
	
	//	Bug found in Chrome, when element has a scrollbar, calculated width
	// 	fails, so now only using style.width
		
		if( value = node.style.width ) {
			
			return removeUnits(value);
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			this.show();
			value = node.offsetWidth;
			this.hide()
		} else {
			
			value = node.offsetWidth;
		}
		
		if( boxModel ) {
			
			value -= (this.getStyle('paddingLeft') || 0) + (this.getStyle('paddingRight') || 0);
		}
		
		// Some browsers add border to offsetWidth, we remove it:)
		if( substractBorder ) {
			
			value -= (this.getStyle('borderLeftWidth') || 0) + (this.getStyle('borderRightWidth') || 0);
		}
		
		return value;
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
		
		//	Bug found in Chrome, when element has a scrollbar, calculated width
		// 	fails, so now only using style.height

		if( value = node.style.height ) {

			return removeUnits(value);
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			this.show();
			value = node.offsetHeight;
			this.hide()
		} else {
			
			value = node.offsetHeight;
		}
		
		if( boxModel ) {
			
			value -= (this.getStyle('paddingTop') || 0) + (this.getStyle('paddingBottom') || 0);
		}
		
		// Some browsers add border to offsetHeight, we remove it:)
		if( substractBorder ) {
			
			value -= (this.getStyle('borderTopWidth') || 0) + (this.getStyle('borderBottomWidth') || 0);
		}
		
		return value;
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
		
		if( fromBody && fromBody !== true ) {

			this.setStyle(lower, fromBody);

			return this;
		}

		return this.getXY(fromBody)[lower];
	}
});

