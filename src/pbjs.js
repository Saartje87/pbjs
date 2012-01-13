//= compat
/**
 * pbjs JavaScript Framework v<%= PB_VERSION %>
 * 2011 Niek Saarberg
 */
!function ( name, context, definition ) {
	
	if( typeof module !== 'undefined' && typeof module.exports === 'object' ) {
		
		module.exports = definition(context);
	} else if ( typeof define === 'function' && typeof define.amd === 'object' ) {
		
		define( function () { console.log('asd'); return definition(context) } ) ;
	} else {
		
		this[name] = definition(context);
	}
}('PB', this, function ( context ) {

"use strict";

var cache = {},
	old = context.PB,
	uid = 0,
	doc = document,
	docElement = doc.documentElement,
	body = doc.body,
	slice = Array.prototype.slice,
	toString = Object.prototype.toString,
	PB = function ( id ) {
		
		return Dom.get(id);
	};

//= require "./core/core"
//= require "./es5/es5"
//= require "./dom/dom"
//= require "./net/net"

return PB;
})

