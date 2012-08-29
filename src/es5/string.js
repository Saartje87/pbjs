/**
 * In the official ecma5 specifications the trim/trimLeft/trimRight methods can't handle
 * an additional arg to trim the string with. So trim methods will be overwriten!
 */
PB.overwrite(String.prototype, {
	
	/**
	 * Trim begin and end of string
	 *
	 * @param string char -> default whitespace
	 * @return string
	 */
	trim: function ( chr ) {
		
		chr = PB.string.escapeRegex(chr) || "\\s";

		return this.replace( new RegExp("(^["+chr+"]+|["+chr+"]+$)", "g"), "" );
	},
	
	/**
	 * Trim begin of string
	 *
	 * @param string char -> default ' '
	 * @return string
	 */
	trimLeft: function ( chr ) {
		
		return this.replace( new RegExp("(^"+( PB.string.escapeRegex(chr) || "\\s")+"+)", "g"), "" );
	},
	
	/**
	 * Trim end of string
	 *
	 * @param string char -> default ' '
	 * @return string
	 */
	trimRight: function ( chr ) {
		
		return this.replace( new RegExp("("+( PB.string.escapeRegex(chr) || "\\s")+"+$)", "g"), "" );
	}
});

