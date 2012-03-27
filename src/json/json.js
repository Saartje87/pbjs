context.JSON || (context.JSON = {});

PB.overwrite(context.JSON, {
	
	stringify: function () {
		
		alert('Not yet implemented for your browser, yet..');
	},
	
	parse: function ( text ) {
		
		// Add JSON validation
		
		return eval('('+text+')');
	}
});