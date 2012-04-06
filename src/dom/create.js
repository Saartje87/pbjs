Dom.create = function ( chunk ) {
	
	var div = document.createElement('div'),
		childs;
	
	div.innerHTML = chunk;
	
	childs = Dom.get(div).childs();
	
	div = null;
	
	childs.forEach( Dom.create.flag );
	
	if( childs.length === 1 ) {
		
		return childs[0];
	}
	
	return childs;
};

Dom.create.flag = function ( element ) {
	
	element._flagged_ = true;
}

