function flagDom ( element ) {
	
	element._flagged_ = 1;
}

function unflagDom ( element ) {
	
	element._flagged_ = 0;
}

Dom.create = function ( chunk ) {
	
	var div = document.createElement('div'),
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

