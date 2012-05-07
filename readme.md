[pbjs](http://pluxbox.nl/products/pbjs) - efficient coding
==========================================================


About
-----

*pbjs* is small and lightweight object orientated framework (*Production:* [~10kb](http://link)).

It's compatible with desktop and mobile browsers. Compared to other DOM based alternatives to jQuery like [Zepto](http://zeptojs.com/) or [QuoJS](http://quojs.tapquo.com/), it has a focus on cross-browser compatibility and performance. Through the modular design - it can also be enhanced with various plugins.



Concept
-------

The usage of *pbjs* is quite easy, especially if you are familiar with other frameworks. Every execution mentioned in the docs is a part of the global 'PB'-object. While some of them needs to be used on a wrapped element, general task will be served solely.

Since a reference to itself will always be returned - fluent programming via method chaining is possible.

In contrast to most AJAX libraries, pbjs was created for developing interactive web application.
Therefore it focuses on **efficient coding** to improve the performance.

Following this principle - it forces the developer to use best practice in JavaScript & an appropriate coding style.

A few ways to achieve this:

- usage of native functions instead of custom regex lookups: the general element selector will be an element ID
- caring about bottlenecks, especially the DOM: everything will be cached internaly to simplify the re-usage
- dont repeat yourself (DRY): using clear function names to avoid multiple declarations for the same purpose
- the future right now: instead of custom calls for general tasks, ES5 polyfills are included
- allowing OOP approaches: support through included class constructs & inheritance
- understand what you do: find a method in the modular structured source (1/3 jQuery)

Of course it works quite well with common [design patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/).



Usage
-----

By default elements used by the pbjs will be cached. A garbage collector will free the memory as they won't be used after a while. To compensate the cost of rarely used objects - it's neccessary to create new ones or keep them alive (*see PB.Request*).


### Wrapper (Selector & Create)

The 'PB'-object can use input for different purposes:

1. Element ID - selector 

        // Retrieve single element    
        PB('element_id')

2. DOM node selector (regular & cached)
        
        // Select single element
        PB(document.body)

3. creating elements

        // Create an element     
        PB('<h1>Peanut Butter and Jelly Sandwich!</h1>').appendTo( [Object PBDom] )

### Request

To do a HTTP-Request, a new Request-Object has to be created and configured with data.
Afterwards a result callback can be declared, which should be triggered after the sending.

    // Create & configure a new request object
    var req = new PB.Request({
    
        url: '42.nl',
        data:{ foo: 'bar' },
        method: POST        
    });
        
        
    // Attach listener & callback
    req.on('success', function ( res ) {
        
        console.log( res.responseJSON );
        
    }).send();
    

### Collections

Collections in *pbjs* are used to select a set of elements. Methods which are supposed to output multiple values returns a collection. 

	// Store collection, crawling is heavy :)
	var collection = PB('element_id').find('div.peanut)


### Style

Changing the style in general is a task of CSS - n

    var login = PB('login'),
    
        current = login.getStyle();
    

setStyle // static
morph // transitions

    
    

### Selector

	// Will return a collections
	PB('element_id').find('div.peanut')


	
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
    


### CSS Selector

The principle of *efficient coding* doesn't exclude DOM crawling with CSS selectors - it just enforces the developer to re-think about his workflow. In cases where you need use classes (prefix 'js-' !), you first select a parent element and then use the method '.find('.className')'. As a result it returns a collection of 'PB(elements)'.

    // Using CSS selector
    var entries = PB(document).find('.js-entries');



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
- Mobile (Tested with *Android, iPhone, Nokia, BlackBery OS*)
