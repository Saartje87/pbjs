PB.overwrite(PB.dom, {
	
	/**
	 * Serialize form element to object
	 *
	 * Tip: Http class can translate to string
	 *
	 * @return object
	 */
	serializeForm: function () {

		var node = this.node,
			elements = PB.toArray(node.elements),
			type,
			data = {},
			exclude = /file|undefined|reset|button|submit|fieldset/i,
			groups = /radio|checkbox/i,
			length;

		if( this.nodeName !== 'FORM' ) {

			throw new Error('Specify a form element to serialize');
		}

		elements.forEach(function ( element ){

			type = element.type;

			if( exclude.test(type) === false && !(groups.test(type) === true && !element.checked) ) {
			
				if( type === 'select-multiple' ) {
					
					data[element.name] = [];
					
					PB.toArray(element.options).forEach(function ( option ){
						
						if( option.selected ) {
							
							data[element.name].push( option.value );
						}
					});
				} else {
					
					data[element.name] = element.value;
				}
			}
		});

		return data;
	}
});

