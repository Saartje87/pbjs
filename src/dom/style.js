var unit = /px$/i,
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
	div = document.createElement('div'),
	supportsOpacity = typeof div.style.opacity !== 'undefined',
	supportsCssFloat = typeof div.style.cssFloat !== 'undefined';

div = null;

function addUnits ( property, value ) {
	
	if( skipUnits.indexOf(property) >= 0 ) {
		
		return value;
	}
	
	return typeof value === 'string' ? value : value+'px';
}

function removeUnits ( value ) {
	
	return unit.test( value ) ? parseInt( value, 10 ) : value;
}

PB.overwrite(Dom.prototype, {
	
	setStyle: function ( property, value ) {
		
		if( arguments.length === 1 ) {
			
			PB.each(arguments[0], this.setStyle, this);
			return this;
		}
		
		if( property === 'opacity' && !supportsOpacity ) {
			
			value = "alpha(opacity="+(value*100)+")";
		}
		// Crossbrowser float
		if( property === 'float' ) {
			
			property = supportsCssFloat ? 'cssFloat' : 'styleFloat';
		}
		
		this.node.style[property] = addUnits( property, value );
		
		return this;
	},
	
	getStyle: function ( property ) {
		
		// Crossbrowser float
		if( property === 'float' ) {
			
			property = supportsCssFloat ? 'cssFloat' : 'styleFloat';
		}
		
		var node = this.node,
			value = node.style[property],
			o;
		
		if( value !== '' ) {
			
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
