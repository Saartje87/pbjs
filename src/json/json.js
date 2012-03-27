context.JSON || (context.JSON = {});

PB.extend(context.JSON, {
	
	stringify: function () {
		
		alert('Not yet implemented for your browser, yet..');
	},
	
	parse: function ( text ) {
		
		// Add JSON validation
		
		return eval('('+text+')');
	}
});