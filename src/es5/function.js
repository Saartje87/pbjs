PB.extend(Function.prototype,{
	
	/**
	 * Created a wrapper function around the `this` object
	 * 
	 * @param mixed scope
	 * @param [mixed] additional arguments
	 * @return function
	 */
	bind: function ( scope/*, arg1, argN*/ ) {
		
		var _args = slice.call( arguments, 1 ),
			fn = this;

		return function () {

			return fn.apply( scope, _args.concat( slice.call( arguments, 0 ) ) );
		};
	}
});

