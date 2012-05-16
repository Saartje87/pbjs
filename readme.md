pbjs
==========================================================

About
-----

*pbjs* is small and lightweight object orientated framework (*Production size:* [~10kb](https://github.com/Saartje87/pbjs/tree/master/bin/pbjs.min.js)).

Compared to other DOM based alternatives, like jQuery, [Zepto](http://zeptojs.com/) or [QuoJS](http://quojs.tapquo.com/), it has a focus on cross-browser/device compatibility and performance. Through the modular design it can be extended with various plugins.



Concept
-------

The usage of *pbjs* is quite easy, especially if you are familiar with other frameworks. Every method mentioned in the docs is a part of the global 'PB'-object. Some of the methods needs to be used on a wrapped element, but most general tasks could be used solely.

Since a reference to itself will always be returned - fluent programming via method chaining is possible.

In contrast to most AJAX libraries, pbjs was created for developing interactive web applications instead of effects or widgets.

*pbjs* focuses on `efficient coding` to improve the performance.

Following this principle it forces the developer to use best practice solutions in JavaScript and an appropriate coding style.

A few ways to achieve this:

- usage of native functions instead of custom regex matches: the general element selector will be an element ID
- caring about bottlenecks, especially the DOM: everything will be cached internaly to simplify the re-usage
- dont repeat yourself (DRY): using clear function names to avoid multiple declarations for the same purpose
- the future right now: instead of custom calls for general tasks, ES5 polyfills are included
- supporting OOP approaches: ease the paradigm through the included class construct & inheritance
- don't wait for it: the framework is defined in the CommonJS way for async module loading
- understand what you do: find a method in the modular structured source

Of course it works quite well with common [design patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/).



Usage
-----

By default elements used by the pbjs will be cached. A garbage collector will free the memory when they are removed from the DOM trough emptying the html. To compensate the cost of rarely used object it is neccessary to create new ones or keep them alive (*see PB.Request*).


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

    // Create & configure a new request object
    var req = new PB.Request({
    
        url: '42.nl',
        data:{ 
            foo: 'bar'
        },
        method: 'POST'        
    });
    
Afterwards a callback can be declared, which should be triggered on the result of the sending.
        
    // Attach listener & callback
    req.on('success', function ( res ) {
        
        // represents the response as an object
        console.log( res.responseJSON );
        
    }).send();
    

### Collections

Collections in *pbjs* are used to select a set of elements. Methods which are supposed to output multiple values returns a collection. 

    // Store collection, crawling is heavy :)
    var collection = PB('element_id').find('div.peanut);

Beside normal Array methods, invokations can be used for mutations as well.

    // Invoke collection with PB.Dom method
    collection.invoke('setStyle', { color: 'brown', backgroundColor: 'purple });
        

### Style

There are two ways in *pbjs* to support CSS - static and transitional. Boht work prefix free, allowing to focus on the input rather than cross browser issues.

> Note that css properties are given in camel case

1. setStyle / getStyle
    
        // Receive the current style
        PB('element_id').getStyle('opacity');
        
        //  Adding style properties (including CSS3)
        PB('element_id').setStyle('transform', 'rotate(30deg)');

3. morph (Transitions)
    
        // Change the style over a time period
        login.morph({                     
           opacity: current/2        
        }, 1.2 /* 1.2 seconds */, function( element ){        
           element.remove();
        });


### Classes

Classes are usefull for creating complex structures and maintaining large applications. Through the abstraction layer of a class - it's very easy to create new objects which inherits from another one.
    
    // Create an 'Animal' class
    var Animal = PB.Class({
        
        // Class constructor
        construct: function () {
            
            console.log( 'I am an animal' );
        }        
    });
    
    // Create an 'Ape' class, which extends the the former 'Animal'
    var Ape = PB.Class( Animal, {
        
        construct: function () {            
                   
            console.log( 'I am an Ape' );
        }        
    });
        
    new Ape; 
        
    // Result
    > I'am an Ape

It's not just possible to access the inherited properties of the parent - but also get the result of an executed function directly.
        
    var Goat = PB.Class( Animal, {
        
        construct: function () {            
            
            this.parent();
            console.log( 'I am a Goat' );
        }        
    });       
    
    new Goat;
    
    // Result
    > I'am an Animal
    > I'am a Goat


### CSS Selector

The principle of *efficient coding* doesn't exclude DOM crawling with CSS selectors - it just enforces the developer to re-think about his workflow. In cases where you need use classes (prefix 'js-' !), you first select a parent element and then use the method '.find('.className')'. As a result it returns a collection of 'PB(elements)'.

    // Using CSS selector
    var entries = PB(document).find('.js-entries');


### Compatibility

- IE7+
- Firefox 3+
- Safari 4+
- Opera
- Chrome
- Mobile (Tested with *Android, iPhone, Nokia, BlackBerry Tablet OS*)



License
-------
This project is under the MIT License.

*Powered by Pluxbox*

*Copyright 2011-2012, Niek Saarberg*
