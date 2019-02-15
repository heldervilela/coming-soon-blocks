/**
 * Block slideshow background.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */
import Flickity from 'flickity'

/**
 * Config
 */
const flickityOptions = {
	autoPlay: 5000,
	pageDots: false,
	prevNextButtons: false,
	draggable: false,
	wrapAround: true
};

/**
 * Component
 *
 * @since    1.0.0
 */
function Component() {

	const Element = document.querySelector( '[data-component="slideshow-background"] > div' );

	// Check for element
	if( ! Element ) return;

	new Flickity( Element, flickityOptions);

}

// Document ready
document.addEventListener( "DOMContentLoaded", Component(), false );
