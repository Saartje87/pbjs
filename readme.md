# pbjs
=============
pbjs is small(**Production (gzip): ~ 10kb**) and lightweight object orientated framework. Compatible with desktop and mobile browsers. Compared to other DOM based alternatives to jQuery like [Zepto](http://zeptojs.com/) or [QuoJS](http://quojs.tapquo.com/), it has a focus on cross-browser compatibility and performance. Through the modular design - it can be enhanced with various plugins.

## Syntax

PB(\<element_id\>)

PB(\<node\>)

PB(\<html_string\>)

	// Retrieve single element wrapper
	PB('element_id')
	PB(document.body)
	
	// Create an element
	PB('<h1>Peanut Butter and Jelly Sandwich!</h1>').appendTo( [Object PBDom] )
	
	// Sample syntax
	PB('element_id').setStyle({
		
		color: 'brown',
		backgroundColor: 'purple'
	})

## Selector

	// Will return a collections
	PB('element_id').find('div.peanut')

## Using collections

Collections are used to change a set of elements. Methods that supposedly return multiple elements will always return a collection. 

	// Store collection, crawling is heavy :)
	var collection = PB('element_id').find('div.peanut)
	
### Possible mutators

	// Invoke collection with PB.Dom method
	collection.invoke('setStyle', { color: 'brown', backgroundColor: 'purple })
	
	// Ecma 5 like mutators
	collection.forEach([Function])
	collection.filter([Function])
	collection.every([Function])
	collection.map([Function])
	collection.some([Function])
	collection.indexOf([Function])

## Ecma5 polyfills

For older browsers pbjs adds some polyfills.

* Array
* Date
* Function
* Object
* String


## Compatible with

- IE7+
- Firefox 3+
- Safari 4+
- Opera
- Chrome
- Mobile (Tested with *Android, iPhone, Nokia*)
