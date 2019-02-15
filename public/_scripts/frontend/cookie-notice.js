/**
 * Password protected component.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */
import {setCookie} from './utils/tools.js'

class Component {

	constructor() {

		this.element = document.querySelector( '[data-component="cookie-notice"]' );

		// Check for element
		if( ! this.element ) return;

		// Run config
		this.config = {
			restURL : document.querySelector('body').dataset.resturl,
			nonce: 	document.querySelector('body').dataset.nonce,
		};

		this.init();
	}

	/**
	 * Init
	 */
	init() {
		const Button = this.element.querySelector('button');

		// Button
		Button.addEventListener('click', (event) => {
			event.preventDefault();
			setCookie("comingsoonblocks__cookie_notice", 'true', 365);
			this.element.classList.add('-leave');
			setTimeout(()=> this.element.remove(), 2000);
		});
	}

}

// Document ready
document.addEventListener( "DOMContentLoaded", new Component(), false );
