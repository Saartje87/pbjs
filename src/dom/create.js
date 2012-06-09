function flagDom ( element ) {
	
	element._flagged_ = 1;
}

function unflagDom ( element ) {
	
	element._flagged_ = 0;
}

/**
 * Create html element(s) form string
 * 
 * Table elements are not supported :(
 */
Dom.create = function ( chunk ) {
	
	var div = doc.createElement('div'),
		childs;
	
	div.innerHTML = chunk;
	
	childs = Dom.get(div).childs();
	
	div = null;
	
	childs.forEach( flagDom );
	
	// Unflag childs after 2 minutes so our
	// garbage collecter can remove them from memory
	setTimeout(function() {
		
		childs.forEach( unflagDom );
	}, 120000);
	
	if( childs.length === 1 ) {
		
		return childs[0];
	}
	
	return childs;
}

/**
 * Create html element(s) form string
 *
 * ** TEST **
 */
Dom.create2 = function ( chunk ) {
	
	var dummy;
	
	// Clean html string from special chars
	chunk = chunk.replace(/(?:\t|\r|\n|^\s|\s$)+/, '');
	
	// Add dummy element
	dummy = document.createElement('div');
	
	/*
	console.log( chunk )
	
	// Is table element
	if( /^<(?:td|tr|th)/.test(chunk) ) {
		
		
	} else {
		
		
	}
	*/
	
//	console.log( chunk );
	
	
	
	fragment.appendChild(dummy);
}

