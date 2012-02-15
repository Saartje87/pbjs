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
 */
function cleanupCache () {
	
	PB.each(cache, function ( i, Dom ) {

		if( !Dom.descendantOf(body) && Dom.node !== doc && Dom.node !== window ) {

			Dom.remove();
		}
	});
};

