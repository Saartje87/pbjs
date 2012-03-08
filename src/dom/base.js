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
	
	var _doc = PB(doc);
	
	PB.each(cache, function ( i, Dom ) {

		if( Dom.node != window && !_doc.contains(Dom) ) {

			Dom.remove();
		}
	});
};

