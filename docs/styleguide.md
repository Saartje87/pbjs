#Styleguide

Preferred function declaration
	
	var foo = function () {
		
		
	}
	
	function () {
	
	}

	function foo() {
	
	
	}

Variable declaration
Variable declarations inside a function should always be declared at the beginning of the function

	var foo,
		bar;

Indents show the level of indents

	PB('foo')
		.addClass('bar')
		.removeClass('foo')
		.morph({ width: 200 })
		.childs()
			.invoke('addClass', 'foor bar');

String, note there are no spaces between

	'foo '+bar;

Working with object

	{
		foo: bar,
		foo: function () {
		
		
		},
		"foo-bar": bar
	}

Switch case

	switch ( baz ) {
	
		case 'foo':
			// Stuff
			break;
	
		case 'bar':
			// Stuff
			break;
	
		default:
			// Stuff
	}

Optimisation

- For finding elements trough a css selector
-- Try using the nodeName PB(document).find('div.className') instead of PB(document).find('.className')