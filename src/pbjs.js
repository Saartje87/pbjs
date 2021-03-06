//= compat
/*!
 * pbjs JavaScript Framework v<%= PB_VERSION %>
 * https://github.com/Saartje87/pbjs
 *
 * This project is powered by Pluxbox
 *
 * copyright 2011-2012, Niek Saarberg
 * MIT License
 */
(function ( name, context, definition ) {
	
	if( typeof module !== 'undefined' && typeof module.exports === 'object' ) {
		
		module.exports = definition(context);
	} else if ( typeof define === 'function' && typeof define.amd === 'object' ) {
		
		define( function () { return definition(context); } ) ;
	} else {
		
		this[name] = definition(context);
	}
})('PB', this, function ( context, undefined ) {

"use strict";

var old = context.PB,
	uid = old ? old.id() : 0,
	win = window,
	doc = document,
	docElement = doc.documentElement,
	body = doc.body,
	slice = Array.prototype.slice,
	toString = Object.prototype.toString,
	PB = function ( id ) {
		
		return Dom.get(id);
	};

// Declare cache
PB.cache = old && old.cache ? old.cache : {};

// Version
PB.VERSION = '<%= PB_VERSION %>';

//= require "./core/core"
//= require "./es5/es5"
//= require "./dom/dom"
//= require "./net/net"
//= require "./json/json"
//= require "./string/string"

PB.noConflict = function () {

	context.PB = old;

	return this;
};

return PB;
});

//= require "./qwery/qwery"

