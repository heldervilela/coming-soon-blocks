/**
 * Password protected component.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */
import {buildAjaxUrl} from './utils/tools.js'

class Component {

	constructor() {

		this.element = document.querySelector( '[data-component="unlock-page"]' );

		// Check for element
		if( ! this.element ) return;

		// Run config
		this.body = document.body;
		this.Input = this.element.querySelector('input');
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

		const Button = this.element.querySelector('.button');
		const Overlayer = this.element.querySelector('.page-overlayer');
		const Input = this.Input;
		const body = this.body;

		// Button
		Button.addEventListener('click', (event) => {
			event.preventDefault();

			// Open
			if( this.element.dataset.mode === 'close' ) {
				this.element.dataset.mode = 'open';
			}

			// Validate Password
			else {
				this.submit();
			}
		});

		// Layer
		Overlayer.addEventListener('click', (event) => {
			event.preventDefault();

			this.element.dataset.mode = 'close';
			Input.value = '';
			Input.classList.remove('-error');
		});

	}

	/**
	 * Init
	 */
	 submit() {

	 	const Input = this.Input;

		// Empty input
		if( Input.value === '' ) {
			Input.classList.add('-error');

			// Remove event if user edit the input
			Input.onkeypress = function() {
				Input.classList.remove('-error');
				delete Input.onkeypress;
			};
		}
		// Submit
		else {
			this.element.dataset.loading = true;

			fetch( buildAjaxUrl( this.config.restURL+'v1/unlockpage', {
				_wpnonce: this.config.nonce,
				pwd: Input.value,
			}), {
				method: 'GET'
			})
				.then(response => Promise.all([response.ok, response.json()]))
				.then(([responseOk, body]) => {

					// Sucess
					if (responseOk) {
						location.reload();
					}
					// Error
					else {
						this.element.dataset.message = true;
						this.element.querySelector('.content__wrapper span').innerHTML = `<p class="-error">${body.message}</p>`;
						this.element.dataset.loading = false;
						setTimeout(()=> {
							this.element.dataset.message = false;
						}, 3000 );
					}

				});

		}
	}

}

// Document ready
document.addEventListener( "DOMContentLoaded", new Component(), false );
