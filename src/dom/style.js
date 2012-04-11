var unit = /^[\d.]+px$/i,
	opacity = /alpha\(opacity=(.*)\)/i,
	computedStyle = doc.defaultView && doc.defaultView.getComputedStyle,
	// Do not add px when using there properties
	skipUnits = 'zIndex zoom fontWeight opacity',
	// Css properties that proberly need an prefix
	// Like transition should be MozTransition in firefox
	cssPrefixProperties = 'animationName transform transition transitionProperty transitionDuration'.split(' '),
	// Translation object for properties with a prefix
	// transition => MozTransition, firefox
	// transition => WebkitTransition, chrome/safari..
	cssPropertyMap = {},
	vendorPrefixes = 'O ms Moz Webkit'.split(' '),
	vendorDiv = document.createElement('div'),
	supportsOpacity = vendorDiv.style.opacity !== undefined,
	supportsCssFloat = vendorDiv.style.cssFloat !== undefined,
	i = vendorPrefixes.length;

/**
 * Add prefixes to cssPropertyMap map if needed/supported
 */
cssPrefixProperties.forEach(function ( property ) {
	
	if( property in vendorDiv.style ) {
		
		return;
	}
	
	var j = i,
		prop = property.charAt(0).toUpperCase()+property.substr(1);
	
	while( j-- ) {
		
		if( vendorPrefixes[j]+prop in vendorDiv.style ) {
			
			return cssPropertyMap[property] = vendorPrefixes[j]+prop;
		}
	}
});

// Clear vars
cssPrefixProperties = vendorDiv = null;

/**
 * Add px numeric values
 */
function addUnits ( property, value ) {
	
	if( skipUnits.indexOf(property) >= 0 ) {
		
		return value;
	}
	
	return typeof value === 'string' ? value : value+'px';
}

/**
 * Remove units from px values
 */
function removeUnits ( value ) {
	
	return unit.test( value ) ? parseInt( value, 10 ) : value;
}

/**
 * Get the right property name for this browser
 */
function getCssProperty ( property ) {
	
	// Crossbrowser float
	if( property === 'float' ) {
		
		property = supportsCssFloat ? 'cssFloat' : 'styleFloat';
	}
	
	return cssPropertyMap[property] || property;
}

PB.overwrite(PB.dom, {
	
	/**
	 *
	 */
	setStyle: function ( property, value ) {
		
		if( arguments.length === 1 ) {
			
			PB.each(arguments[0], this.setStyle, this);
			return this;
		}
		
		if( property === 'opacity' && !supportsOpacity ) {
			
			value = "alpha(opacity="+(value*100)+")";
		}
		
		property = getCssProperty( property );
		
		this.node.style[property] = addUnits( property, value );
		
		return this;
	},
	
	/**
	 *
	 */
	getStyle: function ( property ) {
		
		property = getCssProperty( property );
		
		var node = this.node,
			value = node.style[property],
			o;
		
		if( !value ) {
			
			var CSS = computedStyle ? doc.defaultView.getComputedStyle( node, null ) : node.currentStyle;

			value = CSS[property];
		}
		
		if( property === 'opacity' ) {
			
			if( node.style.filter && (o = node.style.filter.match(opacity)) && o[1] ) {
				
				return parseFloat(o[1]) / 100;
			}
			
			return value ? parseFloat(value) : 1.0;
		}
		
		return value === 'auto' ? 0 : removeUnits(value);
	}
});

