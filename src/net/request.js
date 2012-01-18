/**
 * @todo: Do something with different content-types? Like javascript/css/...
 */
PB.Request = PB.Class(/*PB.Observer,*/ {
	
	__extends: PB.Observer,
	
	// Try reusing object as much as possible, to bad ie7 dont support this..
	isReusable: PB.browser.isIE && PB.browser.version <= 7,
	
	readyStateEvents: 'unsent opened headers loading end'.split(' '),
	
	/**
	 * 
	 */
	constructor: function ( options ) {
		
		this.parent();
		
		this.transport = false;
		
		PB.overwrite(this, PB.Net.defaults);
		PB.overwrite(this, options);
	},
	
	/**
	 * Set option
	 *
	 * data, headers, method, etc..
	 */
	set: function ( key, value ) {
		
		switch( key ) {
			
			case 'header':
			case 'headers':
				if( PB.is('Object', value) === true ) {
					
					PB.overwrite(this.headers, value);
				}
				break;
			
			default:
				this[key] = value;
				break;
		}
		
		return this;
	},
	
	/**
	 * Abstraction to get transport
	 */
	getTransport: function () {
		
		// Damn IE7 cant handle mulitple request of same xmlHttp object
		// So return object for `modern` browsers
		if( this.transport && this.isReusable ) {		// PB.supported.reuseRequest
			
			return this.transport;
		}
		
		// Mimic behavior
		if( this.transport ) {
			
			this.transport.abort();
		}
		
		if( window.XMLHttpRequest ) {
			
			return this.transport = new XMLHttpRequest();
		} else if ( ActiveXObject ) {
			
			return this.transport = new ActiveXObject('MSXML2.XMLHTTP.3.0');
		}
		
		throw Error('Browser doesn`t support XMLHttpRequest');
	},
	
	/**
	 * Send request!
	 */
	send: function () {
		
		var async = this.async,
			request = this.getTransport(),
			url = this.url,
			method = this.method.toUpperCase(),
			params = this.data ? PB.Net.buildQueryString( this.data ) : null;
		
		// Set params for all methods except POST / GETs
		if( params !== null && method !== 'POST' && method !== 'PUT' ) {

			url += (url.indexOf('?') === -1 ? '?' : '&')+params;
			params = null;
		}
		
		// Add onreadystatechange listener
		if( async ) {
			
			request.onreadystatechange = this.onreadystatechange.bind(this);
		}
		
		// Open connection
		request.open( method, url, this.async );
		
		// Set post header
		if( method === 'POST' || method === 'PUT' ) {
			
			request.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded; charset='+this.charset );
		}
		
		// Set headers
		PB.each(this.headers, function( name, val ){
			
			request.setRequestHeader( name, val );
		});
		
		// Send the request
		request.send( params );
		
		if( async === false ) {
			
			this.onreadystatechange();
		}
		
		return this;
	},
	
	/**
	 * Abort the request
	 */
	abort: function () {
		
		this.transport.abort();
		
		this.emit('abort');
		
		return this;
	},
	
	/**
	 * Handle state changs
	 */
	onreadystatechange: function () {
		
		var request = this.transport;
		
		if( request.readyState === 4 ) {
			
			request.responseJSON = null;
			
			if( request.status >= 200 && request.status < 300 ) {
				
				// Parse json string
				if( request.getResponseHeader('Content-type').indexOf( 'application/json' ) >= 0 ) {
					
					request.responseJSON = JSON.parse( request.responseText );
				}
				
				this.emit( 'success', request, request.status );
			} else {
				
				this.emit( 'error', request, request.status );
			}
		}
		
		this.emit( this.readyStateEvents[request.readyState], request, request.readyState === 4 ? request.status : 0 );	
	}
});

