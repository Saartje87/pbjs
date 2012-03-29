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
		
		this.node.style.display = this.get('css-display') || 'block';
		
		this.unset('css-display');
		
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
			
			scroll.left = docElement.scrollLeft;	// || body.scrollLeft;
			scroll.top = docElement.scrollTop;		// || body.scrollTop;
		} else {
			
			scroll.left = node.scrollLeft;
			scroll.top = node.scrollTop;
		}
		
		return scroll;
	}
});

['Width', 'Height'].forEach(function ( name ) {
	
	var pos1 = name === 'Width' ? 'Right' : 'Bottom',
		pos2 = name === 'Width' ? 'Left' : 'Top';
	
	Dom.prototype[name.toLowerCase()] = function ( value ) {
		
		if( value !== undefined ) {
			
			return this.setStyle( lowerName, value );
		}
		
		var node = this.node;
		
		if( node === window ) {
			
			return window['inner'+name];
		} else if ( node.nodeType === 9 ) {
			
			return Math.max(docElement['client'+name], body['scroll'+name], docElement['offset'+name]);
		}
		
		value = this.getStyle('width');
		
		if( value > 0 ) {
			
			return value;
		}
		
		// CSS value failed, calculate
		if( !this.isVisible() ) {
			
			this.show();
			width = node['offset'+name];
			this.hide()
		} else {
			
			width = node['offset'+name];
		}
		
		if( boxModel ) {
			
			width -= (this.getStyle('padding'+pos1) || 0) + (this.getStyle('padding'+pos2) || 0);
		}
		
		// Some browsers add border to offsetWidth, we remove it:)
		if( substractBorder ) {
			
			width -= (this.getStyle('border'+pos1+name) || 0) + (this.getStyle('border'+pos2+name) || 0);
		}
		
		return width;
	};
	
	Dom.prototype['inner'+name] = function () {
		
		return this.width() + (this.getStyle('padding'+pos1) || 0) + (this.getStyle('padding'+pos2) || 0);
	};
	
	Dom.prototype['outer'+name] = function () {
			
		var value = this.getStyle('border'+pos1);
		
		return this['inner'+name]() + (this.node['client'+pos2] + (typeof value === 'string' ? 0 : value));
	};
	
	Dom.prototype['scroll'+name] = function () {
			
		return this.node['scroll'+name];
	};
});

['Left', 'Top'].forEach(function ( name ) {
	
	var lowerName = name.toLowerCase();
	
	Dom.prototype[lowerName] = function ( fromBody ) {
		
		if( fromBody && fromBody !== true ) {
			
			this.setStyle(lowerName, fromBody);
			
			return this;
		}
		
		return this.getXY(fromBody)[lowerName];
	}
	
	Dom.prototype['scroll'+name] = function ( value ) {
		
		if( value === undefined ) {
			
			return this.getScroll()[lowerName];
		}
		
		if( this.node.nodeType === 9 || this.node === window ) {
			
			docElement['scroll'+name] = value;
		} else {
			
			this.node['scroll'+name] = value;
		}
		
		return this;
	}
});

