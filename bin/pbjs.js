/*!
 * pbjs JavaScript Framework v0.5.6
 * https://github.com/Saartje87/pbjs
 *
 * This project is powered by Pluxbox
 *
 * copyright 2011-1012, Niek Saarberg
 * MIT License
 */
!function ( name, context, definition ) {

	if( typeof module !== 'undefined' && typeof module.exports === 'object' ) {

		module.exports = definition(context);
	} else if ( typeof define === 'function' && typeof define.amd === 'object' ) {

		define( function () { return definition(context) } ) ;
	} else {

		this[name] = definition(context);
	}
}('PB', this, function ( context, undefined ) {

"use strict";

var cache = {},
	old = context.PB,
	uid = 0,
	win = window,
	doc = document,
	docElement = doc.documentElement,
	body = doc.body,
	slice = Array.prototype.slice,
	toString = Object.prototype.toString,
	PB = function ( id ) {

		return Dom.get(id);
	};

/**
 * Get unique id inside PB
 *
 * @return number
 */
PB.id = function () {

	return ++uid;
};

/**
 * Overwrite properties or methods in target object
 */
PB.overwrite = function ( target, source ) {

	var key;

	for( key in source ) {

		if( source.hasOwnProperty(key) ) {

			target[key] = source[key];
		}
	}

	return target;
};

/**
 * Extend object
 *
 * Existing values will not be overwritten
 */
PB.extend = function ( target, source ) {

	var key;

	for( key in source ) {

		if( source.hasOwnProperty(key) && typeof target[key] === 'undefined' ) {

			target[key] = source[key];
		}
	}

	return target;
};

/**
 * Loop trough object
 *
 * fn arguments: key, value
 *
 * @param object
 * @param function
 * @param object
 * @return void
 */
PB.each = function ( collection, fn, scope ) {

	var prop;

	if ( !collection || typeof fn !== 'function' ) {

		return;
	}

	for( prop in collection ) {

		if( collection.hasOwnProperty(prop) && fn.call(scope, prop, collection[prop], collection) === true ) {

			return;
		}
	}
};

/**
 *
 */
PB.toArray = function ( collection ) {

	if( toString.call(collection) === '[object Object]' && collection.length ) {

		var result = [],
			length = collection.length,
			i = 0;

		for( ; i < length; i++ ) {

			result[i] = collection[i];
		}

		return result;
	}

	return slice.call(collection);
};

/**
 *
 */
PB.is = function ( type, mixed ) {

	return toString.call(mixed) === '[object '+type+']';
};

/**
 * Execute script in global scope
 *
 * @param string
 * @return void
 */
PB.exec = function ( text ) {

	if( window.execScript ) {

		window.execScript( text );
	} else {

		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
};


/**
 * @todo: isMobile
 */
PB.browser = function (){

	var ua = navigator.userAgent,
		info,
		flash;

	info = {

		isIE: ua.indexOf('MSIE') > -1,
		isChrome: ua.indexOf('Chrome') > -1,
		isFirefox: ua.indexOf('Firefox') > -1,
		isSafari:ua.indexOf('Safari') > -1,
		isNokiaBrowser: ua.indexOf('NokiaBrowser') > -1,
		isOpera: !!window.opera
	};

	info.version = info.isIE
		? parseFloat(ua.match(/MSIE (\d+\.\d+)/)[1])
		: parseFloat(ua.match(/(Chrome|Firefox|Version|NokiaBrowser)\/(\d+\.\d+)/)[2]);

	if( navigator.plugins && navigator.plugins['Shockwave Flash'] ) {

		flash = navigator.plugins['Shockwave Flash'].description;
	} else if ( window.ActiveXObject ) {

		try {

			flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
		} catch (e) {}
	}

	if( flash ) {

		flash = flash.match(/\d+/g);
		flash = Number(flash[0]+'.'+flash[1]);
	}

	info.flash = flash || false;

	return info;
}();

PB.Class = function ( _parent, base ) {

	if( !base ) {

		base = _parent;
		_parent = null;
	}

	var constructor = base.construct,
		klass = function () {

			if( _parent !== null ) {

				if( !constructor ) {

					constructor = _parent.prototype.construct;
				} else {

					var _constructor = constructor;

					constructor = function () {

						var __parent = this.parent;

						this.parent = _parent.prototype.construct;

						_constructor.apply( this, arguments );

						this.parent = __parent;
					};
				}
			}

			if( typeof constructor === 'function' ) {

				constructor.apply( this, arguments );
			}
		};

	if( _parent !== null ) {

		klass.prototype = PB.overwrite( {}, _parent.prototype );
	}

	PB.each(base, PB.Class.extend, klass.prototype);

	return klass;
};

PB.Class.extend = function ( key, method ) {

	var ancestor = this[key],
		_method;

	if( typeof ancestor === 'function' ) {

		_method = method;

		method = function () {

			var _parent = this.parent,
				result;

			this.parent = ancestor;

		 	result = _method.apply( this, arguments );

			this.parent = _parent;

			return result;
		}
	}

	this[key] = method;
};

PB.Observer = PB.Class({

	construct: function () {

		this.listeners = {};
	},

	on: function ( type, fn, scope ) {

		type.split(' ').forEach(function ( type ) {

			if( !this.listeners[type] ) {

				this.listeners[type] = [];
			}

			this.listeners[type].push(fn);
		}, this);

		return this;
	},

	off: function ( type, fn, scope ) {

		this.listeners[type].remove(fn);
	},

	emit: function ( type ) {

		if( !this.listeners[type] ) {

			return this;
		}

		var args = slice.call( arguments, 1 );

		this.listeners[type].forEach(function ( fn ){

			fn.apply(null, args || []);
		});

		return this;
	}
});


/**
 * Implementation to check if object is an array
 *
 * @param mixed object
 * @return boolean
 */
PB.extend(Array, {

	isArray: function ( object) {

		return PB.is('Array', object);
	}
});

PB.extend(Array.prototype, {

	/**
	 * Iterate trough array
	 *
	 * @param function fn
	 * @param mixed scope
	 * @param void
	 */
	forEach: function ( fn, scope ) {

		if ( this === null || typeof fn !== 'function' ) {

			throw new TypeError();
		}

		var length = this.length,
			i = 0;

		while ( i < length ) {

			fn.call(scope, this[i], i, this);

			i++;
		}
	},

	/**
	 * Searches the given array for a value and returns the found index or -1 if none found
	 *
	 * Note! Comparsion is done with ===
	 *
	 * @param mixed searchValue
	 * @param integer startIndex
	 * @return integer
	 */
	indexOf: function ( searchValue, startIndex ) {

		if ( this === null ) {

			throw new TypeError();
		}

		var length = this.length;

		startIndex = startIndex || 0;

		if( length <= startIndex || length === 0 ) {

			return -1;
		}

		while( startIndex < length ) {

			if ( this[startIndex] === searchValue ) {

				return startIndex;
			}

			startIndex++;
		}

	    return -1;
	},

	/**
	 * Searches the given array reversed for a value and returns the found index or -1 if none found
	 *
	 * Note! Comparsion is done with ===
	 *
	 * @param mixed searchValue
	 * @param integer stopIndex
	 * @return integer
	 */
	lastIndexOf: function ( searchValue, stopIndex ) {

		if ( this === null ) {

			throw new TypeError();
		}

		var length = this.length;

		stopIndex = stopIndex || 0;

		if( length <= stopIndex || length === 0 ) {

			return -1;
		}

		while( stopIndex <= length ) {

			length--;

			if ( this[length] === searchValue ) {

				return length;
			}
		}

	    return -1;
	},

	/**
	 * Iterate trough array and return new array with filtered values
	 *
	 * @param function fn
	 * @param scope mixed
	 * @return array
	 */
	filter: function ( fn, scope ) {

		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}

		var result = [],
			i = 0,
			length = this.length;

		while ( i < length ) {

			if( !!fn.call(scope, this[i], i, this) ) {

				result.push( this[i] );
			}

			i++;
		}

		return result;
	},

	/**
	 * Iterate trough array and return true when <b>all</b> values match
	 *
	 * @param function fn
	 * @param mixed scope
	 * @return boolean
	 */
	every: function ( fn, scope ) {

		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}

		var length = this.length,
			i = 0;

		while ( i < length ) {

			if( fn.call(scope, this[i], i, this) === false ) {

				return false;
			}

			i++;
		}

		return true;
	},

	/**
	 * Return new array with modified values
	 *
	 * @param function fn
	 * @param mixed scope
	 * @return boolean
	 */
	map: function ( fn, scope ) {

		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}

		var length = this.length,
			result = new Array( length ),
			i = 0;

		while ( i < length ) {

			if( i in this ) {

				result[i] = fn.call(scope, this[i], i, this);
			}

			i++;
		}

		return result;
	},

	/**
	 * Iterate trough array and return true when atleast one value matches
	 *
	 * @param function fn
	 * @param mixed scope
	 * @return boolean
	 */
	some: function ( fn, scope ) {

		if ( this === null || typeof fn !== "function" ) {

			throw new TypeError();
		}

		var length = this.length,
			i = 0;

		while ( i < length ) {

			if( fn.call(scope, this[i], i, this) === true ) {

				return true;
			}

			i++;
		}

		return false;
	},

	reduce: function () {


	},

	reduceRight: function () {


	}
});

PB.extend(Object, {

	/**
	 * Retrieve keys from object as array
	 *
	 * @param object object
	 * @return array
	 */
	keys: function ( object ) {

		if ( this === null || PB.is('Object', object) === false ) {

			throw new TypeError();
		}

		var result = [],
			key;

		for( key in object ) {

			if( object.hasOwnProperty( key ) ) {

				result.push( key );
			}
		}

		return result;
	},

	/**
	 * Nasty solution to retrieve objectPrototype
	 *
	 * Note: constructor could be overwriten.. so it`s not the best solution
	 * Todo: Test, test, test... fix fix fix! Not working properly
	 */
	getPrototypeOf: function ( object ) {

		var constructor = object.constructor,
			oldConstructor;

		if( typeof object.__proto__ !== "undefined" ) {

			return object.__proto__;
		}

		if( object.hasOwnProperty( object.constructor ) ) {

			oldConstructor = object.constructor;

			if( (delete object.constructor) === false ) {

				return null;
			}

			constructor = object.constructor;
			object.constructor = oldConstructor;
		}

		return constructor ? constructor.prototype : null;
	}
});

PB.extend(Function.prototype,{

	/**
	 * Created a wrapper function around the `this` object
	 *
	 * @param mixed scope
	 * @param [mixed] additional arguments
	 * @return function
	 */
	bind: function ( scope/*, arg1, argN*/ ) {

		var _args = slice.call( arguments, 1 ),
			fn = this;

		return function () {

			return fn.apply( scope, _args.concat( slice.call( arguments, 0 ) ) );
		};
	}
});

/**
 * In the official ecma5 specifications the trim/trimLeft/trimRight methods can't handle
 * an additional arg to trim the string with. So trim methods will be overwriten!
 */
PB.overwrite(String.prototype, {

	/**
	 * Trim begin and end of string
	 *
	 * @param string char -> default whitespace
	 * @return string
	 */
	trim: function ( chr ) {

		chr = chr || "\\s";

		return this.replace( new RegExp("(^["+chr+"]+|["+chr+"]+$)", "g"), "" );
	},

	/**
	 * Trim begin of string
	 *
	 * @param string char -> default ' '
	 * @return string
	 */
	trimLeft: function ( chr ) {

		return this.replace( new RegExp("(^"+(chr || "\\s")+"+)", "g"), "" );
	},

	/**
	 * Trim end of string
	 *
	 * @param string char -> default ' '
	 * @return string
	 */
	trimRight: function ( chr ) {

		return this.replace( new RegExp("("+(chr || "\\s")+"+$)", "g"), "" );
	}
});

PB.extend(Date, {

	now: function () {

		return (new Date()).getTime();
	}
});


var Dom = PB.Dom = function ( node ) {

	this.node = node;

	if( node.nodeName ) {

		this.nodeName = node.nodeName.toUpperCase();
	}

	this.storage = {};
};

Dom.prototype.toString = function () {

	return '[Object Dom]';
};

/**
 * Clear cache var
 *
 * Exclude objects that got documentFragement as parent?
 */
function cleanupCache () {

	var docEl = PB(docElement),
		key,
		Dom;

	for( key in cache ) {

		Dom = cache[key];

		if( cache.hasOwnProperty(key) && Dom.node !== win && Dom.node !== doc && Dom.node !== docElement && !docEl.contains(Dom) ) {

			Dom.remove();
		}
	}
};

/**
 * Retrieve element with Dom closure
 */
Dom.get = function ( element ) {

	if( !element ) {

		return null;
	}

	if( element instanceof Dom ) {

		return element;
	}

	if( typeof element === 'string' ) {

		if( element.charAt(0) === '<' ) {

			return Dom.create( element );
		}

		element = doc.getElementById( element );
	}

	if( (!element || (element.nodeType !== 1 && element.nodeType !== 9)) && element !== window ) {

		return null;
	}

	if( typeof element.__PBJS_ID__ === 'number' && cache.hasOwnProperty(element.__PBJS_ID__) === true ) {

		return cache[element.__PBJS_ID__];
	}

	element.__PBJS_ID__ = PB.id();

	return cache[element.__PBJS_ID__] = new Dom( element );
};

Dom.get.extend = function ( methods ) {

	if( arguments.length === 2 ) {

		Dom.prototype[arguments[0]] = arguments[1];
		return;
	}

	PB.extend( Dom.prototype, methods );
};

var Collection = PB.Collection = function ( collection ) {

	var i = 0;

	if( !collection ) {

		this.length = 0;
		return;
	}

	this.length = collection.length;

	for( ; i < this.length; i++ ) {

		this[i] = collection[i];
	}
};

Collection.prototype = {

	toString: function () {

		return '[Object DomCollection]';
	},

	invoke: function () {

		var args = PB.toArray(arguments),
			method = args.shift(),
			i = 0;

		for ( ; i < this.length; i++ ){

			this[i][method].apply( this[i], args );
		}

		return this;
	},

	push: function ( item ) {

		this[this.length++] = item;

		return this;
	},

	forEach: Array.prototype.forEach,
	filter: Array.prototype.filter,
	every: Array.prototype.every,
	map: Array.prototype.map,
	some: Array.prototype.some,
	indexOf: Array.prototype.indexOf
};

PB.overwrite(Dom.prototype, {

	set: function ( key, value ) {

		this.storage[key] = value;

		return this;
	},

	get: function ( key ) {

		var value = this.storage[key];

		return value !== undefined
			? value
			: undefined;
	},

	unset: function ( key ) {

		return delete this.storage[key];
	}
});

PB.overwrite(Dom.prototype, {

	/**
	 * Set/get/remove attribute
	 * null values will remove attribute
	 *
	 * @return mixed
	 */
	attr: function ( key, value ) {

		if( PB.is('Object', key) ) {

			PB.each(key, this.attr, this);
			return this;
		}

		var node = this.node;

		if( value === undefined ) {

			return node.getAttribute(key);
		} else if ( value === null ) {

			node.removeAttribute(key);
		} else {

			node.setAttribute(key, value);
		}

		return this;
	},

	/**
	 * Set / get value from form element
	 */
	val: function ( value ) {

		var node = this.node;

		if( value === undefined ) {

			return node.value;
		}

		node.value = value;

		return this;
	}
});

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
	supportsOpacity = div.style.opacity !== undefined,
	supportsCssFloat = div.style.cssFloat !== undefined;

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

		if( property === 'float' ) {

			property = supportsCssFloat ? 'cssFloat' : 'styleFloat';
		}

		this.node.style[property] = addUnits( property, value );

		return this;
	},

	getStyle: function ( property ) {

		if( property === 'float' ) {

			property = supportsCssFloat ? 'cssFloat' : 'styleFloat';
		}

		var node = this.node,
			value = node.style[property],
			o;

		if( !value ) {

			var CSS = computedStyle ? doc.defaultView.getComputedStyle( node, null ) : node.currentStyle;

			if( property in hooks ) {

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

var div = document.createElement('div'),
	prefixes = 'Khtml O ms Moz Webkit'.split(' '),
	i = prefixes.length,
	animationName = 'animationName',
	transitionProperty = 'transitionProperty',
	transitionDuration = 'transitionDuration',
	supportsCSSAnimation = animationName in div.style;

while( !supportsCSSAnimation && i-- ) {

	if( prefixes[i]+'AnimationName' in div.style ) {

		animationName = prefixes[i]+'AnimationName';
		transitionProperty = prefixes[i]+'TransitionProperty';
		transitionDuration = prefixes[i]+'TransitionDuration';
		supportsCSSAnimation = true;
		break;
	}
}

Dom.supportsCSSAnimation = supportsCSSAnimation;

Dom.prototype.morph = function ( to/* after, duration, effect */ ) {

	var options = {

			to: to,
			duration: .4	// Default duraton
		},
		i = 1,
		from = {},
		properties = '',
		me = this;

	for( ; i < arguments.length; i++ ) {

		switch( typeof arguments[i] ) {

			case 'function':
				options.after = arguments[i];
				break;

			case 'number':
				options.duration = arguments[i];
				break;
		}
	}

	if( !supportsCSSAnimation ) {

		this.setStyle(to);

		if( options.after ) {

			options.after();
		}

		return this;
	}

	if( options.after ) {

		me.once('webkitTransitionEnd oTransitionEnd transitionend', options.after);
	}

	PB.each(options.to, function ( key, value ) {

		properties += key.replace(/[A-Z]/g, function (m) { return '-'+m.toLowerCase(); })+',';

		from[key] = me.getStyle( key ) || 0;	// || 0, tmp fix
	});

	properties = properties.substr( 0, properties.length-1 );

	from[transitionProperty] = properties;
	from[transitionDuration] = options.duration+'s';

	this.setStyle( from );

	setTimeout(function() {

		me.setStyle(to);
	}, 16.7);

	return this;
};

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

	testElement.style.width = testElement.style.paddingLeft = '1px';

	boxModel = (testElement.offsetWidth === 2);

	testElement.style.borderLeft = '1px solid #000';

	substractBorder = (testElement.offsetWidth === 3);

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

			return Math.max(docElement['clien'+name], body['scroll'+name], docElement['offset'+name]);
		}

		value = this.getStyle('width');

		if( value > 0 ) {

			return value;
		}

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

PB.overwrite(Dom.prototype, {

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

		return node.contains
			? node !== element && node.contains( element )
			: !!(node.compareDocumentPosition( element ) & 16);
	},

	find: function ( expression ) {

		return new Collection( qwery( expression, this.node ).map(Dom.get) );
	}
});

var tableInnerHTMLbuggie = false;

try {

	document.createElement('table').innerHTML = '<tr></tr>';
} catch (e) {

	tableInnerHTMLbuggie = true;
}

PB.overwrite(Dom.prototype, {

	/**
	 * Append element to self
	 */
	append: function ( element ) {

		if( (element = Dom.get(element)) === null ) {

			return null;
		}

		this.node.appendChild( element.node );

		return this;
	},

	/**
	 * Append self to target element
	 */
	appendTo: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		target.append( this );

		return this;
	},

	/**
	 * Insert self before target element
	 */
	insertBefore: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		target.parent().node.insertBefore( this.node, target.node );

		return this;
	},

	/**
	 * Insert self after target element
	 */
	insertAfter: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		var next = target.next();

		if( next === null ) {

			target.parent().node.appendChild( this.node );
		} else {

			target.parent().node.insertBefore( this.node, next.node );
		}

		return this;
	},

	insertFirst: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		if( target.first() === null ) {

			target.append( this );
		} else {

			this.insertBefore( target.first() );
		}

		return this;
	},

	replace: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		this.insertBefore( target );

		target.remove();

		return this;
	},

	clone: function ( deep ) {

		var clone = this.node.cloneNode( deep ),
			childs = clone.getElementsByTagName('*'),
			length = childs,
			i = 0;

		clone.removeAttribute('id');
		clone.removeAttribute('__PBJS_ID__');

		for ( ; i < length; i++) {

			childs[i].removeAttribute('id');
			childs[i].removeAttribute('__PBJS_ID__');
		}

		return Dom.get(clone);
	},

	remove: function () {

		var node = this.node,
			pbid = node.__PBJS_ID__,
			morph;

		if( morph = this.get('pbjs-morph') ) {

			morph.off();
		}

		_Event.purge( pbid );

		if( node.parentNode ) {

			node.parentNode.removeChild( node );
		}

		this.node = node = null;

		delete cache[pbid];
	},

	empty: function () {

		this.html('');

		cleanupCache();

		return this;
	},

	/**
	 * @todo script tags with src tag set should be appended to document
	 */
	html: function ( html, execScripts ) {

		if( html === undefined ) {

			return this.node.innerHTML;
		}

		if( execScripts ) {

			html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/ig, function ( match, text ) {

				PB.exec( text );

				return '';
			});
		}

		if( tableInnerHTMLbuggie ) {

			if( /^<(tbody|tr)>/i.test( html ) ) {

				var table = Dom.create('<table>'+html+'</table>');

				this.html('');

				(table.first().nodeName === 'TBODY' ? table.first() : table)
					.childs().invoke('appendTo', this);

				return this;
			}
			if ( /^<(td)>/i.test( html ) ) {

				var table = Dom.create('<table><tr>'+html+'</tr></table>');

				this.html('');

				table.find('td').invoke('appendTo', this);

				return this;
			}
			if( /(TBODY|TR|TD|TH)/.test(this.nodeName) ) {

				this.childs().invoke('remove');

				return this;
			}
		}

		this.node.innerHTML = html;

		return this;
	},

	text: function ( str ) {

		var node = this.node;

		if( str === undefined ) {

			return node.text || node.textContent || node.innerText || node.innerHTML || node.innerText || '';
		}

		this.empty();

		node.appendChild( document.createTextNode( str ) );

		return this;
	}
});

/**

TODO:
- mouseenter and mouseleave
- Custo events: like element.on('myCustomEvent', function(){});

How its cached:
cache = {

	element.__PBJS_ID__: {

		node: node,	// Could be fetched from local.ElementCache
		"click": [],
		"mouseup": [
			{
				handler: fn
				responder: fn
			}
		]
	}
}

 */

var _Event = {

	supports_mouseenter_mouseleave: 'onmouseenter' in doc.documentElement && 'onmouseleave' in doc.documentElement,

	HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,

	MouseEvents: /^(?:click|mouse(?:down|up|over|move|out))$/,

	manualExtend: false,

	/**
	 * Event cache
	 */
	cache: {},

	/**
	 * Create the event wrapper
	 *
	 * @return function
	 */
	createResponder: function ( uid, type, handler ) {

		return function ( event ) {

			var cacheEntry = _Event.cache[uid];

			event = _Event.extend( event, uid );
			handler.call( cacheEntry.node, event );
		};
	},

	/**
	 * Remove all events from element
	 *
	 * Use when removing an element
	 */
	purge: function ( uid ) {

		var cache = _Event.cache[uid],
			node,
			keys;

		if( !cache ) {

			return;
		}

		node = cache.node;
		keys = Object.keys(cache);

		keys.forEach(function ( type ){

			if( type === 'node' ) {

				return;
			}

			Dom.get(node).off( type );
		});

		delete _Event.cache[uid];

		node = null;

		return;
	},

	/**
	 * Extend event manualy for browsers that dont support
	 * Event.prototype
	 */
	extend: function ( event, uid ) {

		if( _Event.manualExtend === false ) {

			return event;
		}

		var docEl = doc.documentElement,
			body = doc.body;

		PB.overwrite( event, _Event.methods );

		event.target = event.srcElement || _Event.cache[uid].node;

		event.currentTarget = _Event.cache[uid].node;

		switch ( event.type ) {

			case 'mouseover':
			case 'mouseenter':
				event.relatedTarget = event.fromElement;
				break;

			case 'mouseout':
			case 'mouseleave':
				event.relatedTarget = event.toElement;
				break;
		}

		if( !event.pageX || !event.pageY ) {

			event.pageX = event.clientX + (docEl.scrollLeft || body.scrollLeft) - (docEl.clientLeft || 0);
			event.pageY = event.clientY + (docEl.scrollTop || body.scrollTop) - (docEl.clientTop || 0);
		}

		event.which = event.keyCode === undefined ? event.charCode : event.keyCode;

		event.which = (event.which === 0 ? 1 : (event.which === 4 ? 2: (event.which === 2 ? 3 : event.which)));

		return event;
	}
};

/**
 *
 */
_Event.methods = {

	stop: function () {

		this.preventDefault();
	    this.stopPropagation();
	}
};

/**
 * Extend event prototype with DOM level 2 events
 */
if (window.addEventListener) {

	PB.overwrite(Event.prototype, _Event.methods);
}

/**
 * Add methods for non DOM level 2 events
 */
if( window.attachEvent && !window.addEventListener ) {

	_Event.manualExtend = true;

	PB.overwrite(_Event.methods, {

		stopPropagation: function () {

			this.cancelBubble = true;
		},

		preventDefault: function () {

			this.returnValue = false;
		}
	});
}

/**
 *
 */
PB.overwrite(Dom.prototype, {

	/**
	 *
	 */
	on: function ( type, handler ) {

		var types = type.split(' ');

		if( types.length > 1 ) {

			types.forEach(function ( type ) {

				this.on( type, handler );
			}, this);
			return this;
		}

		var node = this.node,
			uid = node.__PBJS_ID__,
			events = _Event.cache[uid],
			eventsType,
			i;

		if( type === 'mouseenter' && _Event.supports_mouseenter_mouseleave === false ) {

			type = 'mouseover';
		} else if ( type === 'mouseleave' && _Event.supports_mouseenter_mouseleave === false ) {

			type = 'mouseout';
		}

		if( !events ) {

			_Event.cache[uid] = events = {node: node};
		}

		if( !events[type] ) {

			events[type] = [];
		}

		eventsType = events[type];

		i = eventsType.length;

		while( i-- ) {

			if( eventsType[i].handler === handler ) {

				return this;
			}
		}

		var entry = {

			handler: handler,
			responder: _Event.createResponder( uid, type, handler )
		};

		eventsType.push( entry );

		if( node.addEventListener ) {

			node.addEventListener( type, entry.responder, false );
		} else {

			node.attachEvent( 'on'+type, entry.responder );
		}

		node = null;

		return this;
	},

	/**
	 *
	 */
	once: function ( types, handler ) {

		var me = this;

		types.split(' ').forEach(function ( type ) {

			var _handler = function () {

				me.off( type, _handler );

				handler.apply( null, PB.toArray(arguments) );
			};

			this.on(type, _handler);
		}, this);

		return this;
	},

	/**
	 *
	 */
	off: function ( type, handler ) {

		var node = this.node,
			uid = node.__PBJS_ID__,
			events = _Event.cache[uid],
			eventsType,
			entry,
			i;

		if( !events ) {

			return this;
		}

		if( !type ) {

			_Event.purge( uid );
			return this;
		}

		eventsType = events[type];

		if( !eventsType ) {

			return this;
		}

		i = eventsType.length;

		if( !handler ) {

			while( i-- ) {

				this.off( type, eventsType[i].handler );
			}

			return this;
		}

		while( i-- ) {

			if( eventsType[i].handler === handler ) {

				entry = eventsType[i];
				eventsType.splice( i, 1 );

				if( !eventsType.length ) {

					delete _Event.cache[uid][type];
				}
				break;
			}
		}

		if( !entry ) {

			return this;
		}

		if( node.removeEventListener ) {

			node.removeEventListener( type, entry.responder, false );
		} else {

			node.detachEvent( 'on'+type, entry.responder );
		}

		node = null;

		return this;
	},

	/**
	 *
	 */
	emit: function ( type ) {

		var evt;

		if( _Event.HTMLEvents.test(type) ) {

			this.node[type]();
		}
		else if( document.createEvent ) {

			if ( _Event.MouseEvents.test(type) ) {

				evt = document.createEvent('MouseEvents');

				evt.initMouseEvent(
					type, true, true, window,		// type, canBubble, cancelable, view,
					0, 0, 0, 0, 0,					// detail, screenX, screenY, clientX, clientY,
					false, false, false, false,		// ctrlKey, altKey, shiftKey, metaKey,
					0, null);						// button, relatedTarget

				this.node.dispatchEvent(evt);
			} else {

				evt = document.createEvent('Events');

				evt.initEvent( type, true, true );

				this.node.dispatchEvent(evt);
			}
		}
		else {

			var _event = document.createEventObject();
			this.node.fireEvent('on'+type, _event);
		}

		return this;
	}
});

PB.overwrite(Dom.prototype, {

	/**
	 * Serialize form element to object
	 *
	 * Tip: Http class can translate to string
	 *
	 * @return object
	 */
	serializeForm: function () {

		var node = this.node,
			elements = PB.toArray(node.elements),
			type,
			data = {},
			exclude = /file|undefined|reset|button|submit|fieldset/i,
			groups = /radio|checkbox/i,
			length;

		if( this.nodeName !== 'FORM' ) {

			throw new Error('No form found for serialize');
		}

		elements.forEach(function ( element ){

			type = element.type;

			if( exclude.test(type) === false && !(groups.test(type) === true && !element.checked) ) {

				if( type === 'select-multiple' ) {

					data[element.name] = [];

					PB.toArray(element.options).forEach(function ( option ){

						if( option.selected ) {

							data[element.name].push( option.value );
						}
					});
				} else {

					data[element.name] = element.value;
				}
			}
		});

		return data;
	}
});

Dom.create = function ( chunk ) {

	var div = document.createElement('div'),
		childs;

	div.innerHTML = chunk;

	childs = Dom.get(div).childs();

	div = null;

	if( childs.length === 1 ) {

		return childs[0];
	}

	return childs;
};

PB.ready = (function () {

	var ready = !!doc.body || doc.readyState === 'complete',
		queue = [],
		eventMethod = doc.addEventListener ? 'addEventListener' : 'attachEvent',
		eventMethodRemove = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
		eventTypePrefix = doc.addEventListener ? '' : 'on';

	function handleState () {

		if( ready === true || doc.readyState !== 'complete' ) {

			return;
		}

		var fn;

		ready = true;

		doc[eventMethodRemove](eventTypePrefix+'DOMContentLoaded', handleState, false);
		doc[eventMethodRemove](eventTypePrefix+'readystatechange', handleState, false);
		window[eventMethodRemove](eventTypePrefix+'load', handleState, false);

		while( fn = queue.shift() ) {

			fn();
		}

		queue = null;
	}

	if( !ready ) {

		doc[eventMethod](eventTypePrefix+'DOMContentLoaded', handleState, false);
		doc[eventMethod](eventTypePrefix+'readystatechange', handleState, false);
		window[eventMethod](eventTypePrefix+'load', handleState, false);
	}

	/**
	 * Ananomous queue method
	 */
	return function ( fn ) {

		if( ready ) {

			fn();
		} else if ( queue.indexOf(fn) === -1 ) {

			queue.push( fn );
		}
	};
})();


PB.Net = {};

PB.overwrite(PB.Net, {

	/**
	 * Create uri string
	 *
	 * Should be optimized
	 *
	 * 	Example:
	 * 	{
	 * 		key1: "value1",
	 *		key2: ["val1", "val2", "val"]
	 *	}
	 *
	 *	Output:
	 *	key1=value1&key2[]=val1&key2[]=val2&key2[]=val3
	 */
	buildQueryString: function ( mixed, prefix ) {

		var queryString = '';

		if( mixed === null ) {

			return queryString;
		}

		if( typeof mixed === 'string' ) {

			return mixed;
		} else if( Array.isArray(mixed) === true ) {

			mixed.forEach(function ( value, key ) {

				queryString += typeof value === 'object'
					? PB.Net.buildQueryString( value, (prefix || key)+'[]' )
					: (prefix || key)+"="+encodeURIComponent(value)+'&';
			});
		} else if( PB.is('Object', mixed) ) {

			Object.keys(mixed).forEach(function ( key ) {

				queryString += typeof mixed[key] === 'object'
					? PB.Net.buildQueryString( mixed[key], key+'[]' )
					: (prefix || key)+"="+encodeURIComponent(mixed[key])+'&';
			});
		}

		return queryString.replace(/&$/, '');
	}
});

/**
 * Default Request values
 */
PB.Net.defaults = {

	url: null,
	data: null,
	method: 'GET',
	contentType: 'application/x-www-form-urlencoded',
	async: true,
	username: null,
	password: null,
	charset: 'UTF-8',
	headers: {
		'X-Requested-With': 'PBJS-'+PB.VERSION,
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	},
	crossDomain: false
};

/**
 * @todo: Do something with different content-types? Like javascript/css/...
 */
PB.Request = PB.Class(PB.Observer, {

	isReusable: PB.browser.isIE && PB.browser.version <= 7,

	readyStateEvents: 'unsent opened headers loading end'.split(' '),

	/**
	 *
	 */
	construct: function ( options ) {

		this.parent();

		this.transport = false;

		PB.overwrite(this, PB.Net.defaults);
		PB.overwrite(this, options);
	},

	/**
	 * Set option
	 *
	 * data, headers, method, etc..
	 */
	set: function ( key, value ) {

		switch( key ) {

			case 'header':
			case 'headers':
				if( PB.is('Object', value) === true ) {

					PB.overwrite(this.headers, value);
				}
				break;

			default:
				this[key] = value;
				break;
		}

		return this;
	},

	/**
	 * Abstraction to get transport
	 */
	getTransport: function () {

		if( this.transport && this.isReusable ) {		// PB.supported.reuseRequest

			return this.transport;
		}

		if( this.transport ) {

			this.transport.abort();
		}

		if( window.XMLHttpRequest ) {

			return this.transport = new XMLHttpRequest();
		} else if ( ActiveXObject ) {

			return this.transport = new ActiveXObject('MSXML2.XMLHTTP.3.0');
		}

		throw Error('Browser doesn`t support XMLHttpRequest');
	},

	/**
	 * Send request!
	 */
	send: function () {

		var async = this.async,
			request = this.getTransport(),
			url = this.url,
			method = this.method.toUpperCase(),
			params = this.data ? PB.Net.buildQueryString( this.data ) : null;

		if( params !== null && method !== 'POST' && method !== 'PUT' ) {

			url += (url.indexOf('?') === -1 ? '?' : '&')+params;
			params = null;
		}

		if( async ) {

			request.onreadystatechange = this.onreadystatechange.bind(this);
		}

		request.open( method, url, this.async );

		if( method === 'POST' || method === 'PUT' ) {

			request.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded; charset='+this.charset );
		}

		PB.each(this.headers, function( name, val ){

			request.setRequestHeader( name, val );
		});

		request.send( params );

		if( async === false ) {

			this.onreadystatechange();
		}

		return this;
	},

	/**
	 * Abort the request
	 */
	abort: function () {

		this.transport.abort();

		this.emit('abort');

		return this;
	},

	/**
	 * Handle state changs
	 */
	onreadystatechange: function () {

		var request = this.transport;

		if( request.readyState === 4 ) {

			request.responseJSON = null;

			if( request.status >= 200 && request.status < 300 ) {

				if( request.getResponseHeader('Content-type').indexOf( 'application/json' ) >= 0 ) {

					request.responseJSON = JSON.parse( request.responseText );
				}

				this.emit( 'success', request, request.status );
			} else {

				this.emit( 'error', request, request.status );
			}
		}

		this.emit( this.readyStateEvents[request.readyState], request, request.readyState === 4 ? request.status : 0 );
	}
});


context.JSON || (context.JSON = {});

PB.extend(context.JSON, {

	stringify: function () {

		alert('Not yet implemented for your browser, yet..');
	},

	parse: function ( text ) {


		return eval('('+text+')');
	}
});

PB.noConflict = function () {

	context.PB = old;

	return this;
};

return PB;
});

/*!
  * Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz & Jacob Thornton 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('qwery', function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')
    , walker = {
        ' ': function (node) {
          return node && node !== html && node.parentNode
        }
      , '>': function (node, contestant) {
          return node && node.parentNode == contestant.parentNode && node.parentNode
        }
      , '~': function (node) {
          return node && node.previousSibling
        }
      , '+': function (node, contestant, p1, p2) {
          if (!node) return false
          return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
        }
      }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    each(r, function(e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j
    o: for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  function collectSelector(root, collector) {
    return function(s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
         if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
         s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
         collector(root.parentNode || root, s, true)
         oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function() {
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function(e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function(e, a) { return e.getAttribute(a) }
   }()
  , hasByClass = !!doc[byClass]
  , hasQSA = doc.querySelector && doc[qSA]
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          return arrayify(root[qSA](selector))
        }
        each(ss = selector.split(','), collectSelector(root, function(ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch(ex) { }
      return selectNonNative(selector, root)
    }
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      each(ss = selector.split(','), collectSelector(root, function(ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
})

