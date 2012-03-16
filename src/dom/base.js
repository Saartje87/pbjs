var Dom = PB.Dom = function ( node ) {
	
	this.node = node;
	
	if( node.nodeName ) {
		
		this.nodeName = node.nodeName.toUpperCase();
	}
	
	// 
	this.storage = {};
};

Dom.prototype.toString = function () {
	
	return '[Object Dom]';
};

/**
 * Clear cache var
 *
 * Exclude objects that got documentFragement as parent?
 */
function cleanupCache () {
	
	var docEl = PB(docElement),
		key,
		Dom;
	
	for( key in cache ) {
		
		Dom = cache[key];
		
		if( cache.hasOwnProperty(key) && Dom.node !== win && Dom.node !== doc && Dom.node !== docElement && !docEl.contains(Dom) ) {
			
			Dom.remove();
		}
	}
};

