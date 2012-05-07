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

/**
 * 
 */
PB.dom.toString = function () {
	
	return '[Object PBDom]';
};

/**
 * Collect detached nodes and remove them from the cache
 * 
 * Flagged nodes are skipped
 *
 * @todo Exclude objects that got documentFragement as parent?
 */
function collectGarbage () {
	
	var docEl = PB(docElement),
		key,
		cache = PB.cache;
	
	for( key in cache ) {
		
		if( cache.hasOwnProperty(key) && !cache[key]._flagged_ && !docEl.contains(cache[key]) ) {
			
			cache[key].remove();
		}
	}
};	

if( !old ) {
	
	setInterval(collectGarbage, 30000);
}

