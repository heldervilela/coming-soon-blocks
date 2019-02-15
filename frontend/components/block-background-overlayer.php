<?php
/**
 * Block background overlayer.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */

if( $overlayOpacity !== 0 ):;
?>
	<div data-component="block-background-overlayer"
	     style="background-color: <?php echo esc_attr($overlayColor) ?>; opacity: <?php echo esc_attr($overlayOpacity/100) ?>;"
	></div>
<?php endif; ?>