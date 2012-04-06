var Dom = PB.Dom = function ( node ) {
	
	this.node = node;
	
	if( node.nodeName ) {
		
		this.nodeName = node.nodeName.toUpperCase();
	}
	
	// 
	this.storage = {};
	
	// window, document, documentElement and body shouldn't be removed
	// So flag the instance
	this._flagged_ = (node === win || node === doc || node === docElement || node === body);
};

// Use PB.dom for extenstions
PB.dom = PB.Dom.prototype;

PB.dom.toString = function () {
	
	return '[Object Dom]';
};

/**
 * Clear cache var
 *
 * Exclude objects that got documentFragement as parent?
 */
function collectGarbage () {
	
	var docEl = PB(docElement),
		key,
		Dom;
	
	for( key in cache ) {
		
		Dom = cache[key];
		
		if( cache.hasOwnProperty(key) && !Dom._flagged_ && !docEl.contains(Dom) ) {
			
		//	console.log( 'Removing: ', Dom.node );
			Dom.remove();
		}
	}
	
	setTimeout(collectGarbage, 30000);
};	

setTimeout(collectGarbage, 30000);

