/**
 * Build Ajax url.
 *
 * @since   1.0.0
 */
export function buildAjaxUrl( url, parameters ) {
	let qs = "";
	for( const key in parameters ) {
		if( parameters.hasOwnProperty( key ) ) {
			const value = parameters[key];
			qs +=
				encodeURIComponent( key ) + "=" + encodeURIComponent( value ) + "&";
		}
	}
	if( qs.length > 0 ) {
		qs  = qs.substring( 0, qs.length - 1 ); //chop off last "&"
		url = url + "?" + qs;
	}

	return url;
}

/**
 * Set cookie.
 *
 * @since   1.0.0
 */
export function setCookie( cname, cvalue, exdays ) {
	const d = new Date();
	d.setTime( d.getTime() + (exdays * 24 * 60 * 60 * 1000) );
	const expires   = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Get cookie.
 *
 * @since   1.0.0
 */
export function getCookie( cname ) {
	const name = cname + "=";
	const ca   = document.cookie.split( ';' );
	for( let i = 0; i < ca.length; i++ ) {
		let c = ca[i];
		while( c.charAt( 0 ) == ' ' ) {
			c = c.substring( 1 );
		}
		if( c.indexOf( name ) == 0 ) {
			return c.substring( name.length, c.length );
		}
	}
	return "";
}

/**
 * Check cookie.
 *
 * @since   1.0.0
 */
export function checkCookie() {
	const user = getCookie( "username" );
	if( user != "" ) {
		alert( "Welcome again " + user );
	} else {
		user = prompt( "Please enter your name:", "" );
		if( user != "" && user != null ) {
			setCookie( "username", user, 365 );
		}
	}
}