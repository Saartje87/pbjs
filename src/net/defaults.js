/**
 * Default Request values
 */
PB.Net.defaults = {
	
	url: null,
	data: null,
	method: 'GET',
	contentType: 'application/x-www-form-urlencoded',
	async: true,
	username: null,
	password: null,
	charset: 'UTF-8',
	headers: {
		'X-Requested-With': 'PBJS-'+PB.VERSION,
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	},
	crossDomain: false
};

