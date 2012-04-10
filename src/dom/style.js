var unit = /^[\d.]+px$/i,
	opacity = /alpha\(opacity=(.*)\)/i,
	computedStyle = doc.defaultView && doc.defaultView.getComputedStyle,
	skipUnits = 'zIndex zoom fontWeight opacity', //.split(' '),
	hooks = {
	
		'border': 'borderLeftWidth borderLeftStyle borderLeftColor',
		'borderColor': 'borderLeftColor',
		'borderWidth': 'borderLeftWidth',
		'borderStyle': 'borderLeftStyle',
		'padding': 'paddingTop paddingRight paddingBottom paddingLeft',
		'margin': 'marginTop marginRight marginBottom marginLeft',
		'borderRadius': 'borderRadiusTopleft'
	},
	cssPropertyMap = { animationName: undefined, transform: undefined, transition: undefined, transitionProperty: undefined, transitionDuration: undefined },
	vendorPrefixes = 'O ms Moz Webkit'.split(' '),
	vendorDiv = document.createElement('div'),
	supportsOpacity = vendorDiv.style.opacity !== undefined,
	supportsCssFloat = vendorDiv.style.cssFloat !== undefined,
	i = vendorPrefixes.length;

PB.each(cssPropertyMap, function ( property ) {
	
	if( property in vendorDiv.style ) {
		
		return cssPropertyMap[property] = property;
	}
	
	var j = i,
		prop = property.charAt(0).toUpperCase()+property.substr(1);
	
	while( j-- ) {
		
		if( vendorPrefixes[j]+prop in vendorDiv.style ) {
			
			return cssPropertyMap[property] = vendorPrefixes[j]+prop;
		}
	}
});

vendorDiv = null;

function addUnits ( property, value ) {
	
	if( skipUnits.indexOf(property) >= 0 ) {
		
		return value;
	}
	
	return typeof value === 'string' ? value : value+'px';
}

function removeUnits ( value ) {
	
	return unit.test( value ) ? parseInt( value, 10 ) : value;
}

function getVendorPrefix ( property ) {
	
	if( vendorDiv.style[property] !== undefined ) {
		
		return 
	}
}

function getCssProp ( property ) {
	
	// Crossbrowser float
	if( property === 'float' ) {
		
		property = supportsCssFloat ? 'cssFloat' : 'styleFloat';
	}
	
	if( property in cssPropertyMap ) {
		
		return cssPropertyMap[property];
	}
	
	return property;
}

PB.overwrite(PB.dom, {
	
	setStyle: function ( property, value ) {
		
		if( arguments.length === 1 ) {
			
			PB.each(arguments[0], this.setStyle, this);
			return this;
		}
		
		if( property === 'opacity' && !supportsOpacity ) {
			
			value = "alpha(opacity="+(value*100)+")";
		}
		
		property = getCssProp( property );
		
		this.node.style[property] = addUnits( property, value );
		
		return this;
	},
	
	getStyle: function ( property ) {
		
		property = getCssProp( property );
		
		console.log( property );
		
		var node = this.node,
			value = node.style[property],
			o;
		
		if( !value ) {
			
			var CSS = computedStyle ? doc.defaultView.getComputedStyle( node, null ) : node.currentStyle;

			// Do hooks
			if( property in hooks ) {

				// Todo: Add browser prefix when needed
				value = hooks[property].split(' ').map(function( value ){

					return CSS[value];
				});

				return value.length === 1
					? removeUnits(value[0])
					: value.join(' ');
			}

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

