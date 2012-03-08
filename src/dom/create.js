Dom.create = function ( chunk ) {
	
	var div = document.createElement('div'),
		childs;
	
	div.innerHTML = chunk;
	
	childs = Dom.get(div).childs();
	
	div = null;
	
	if( childs.length === 1 ) {
		
		return childs[0];
	}
	
	return childs;
};

