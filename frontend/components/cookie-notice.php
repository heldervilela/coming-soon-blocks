<?php
/**
 * Cookie notice component.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */

use Pixelthrone\ComingSoon_Blocks\Utils;

if( isset($_COOKIE['comingsoonblocks__cookie_notice']) && $_COOKIE['comingsoonblocks__cookie_notice'] === 'true') {
	return true;
}

?>
<div data-component="cookie-notice" class="<?php echo $notalone ? '-not-alone' : ''; ?>">
	<p><?php echo Utils\esc_allowed_html( '<b>We use <u>cookies</u></b> to ensure that we give you the best experience on our website.<br> If you continue to use this page we will assume that you are happy with it.', '@@pkg.textdomain' ); ?></p>
	<button><?php esc_html_e( 'Got it, Thanks!', '@@pkg.textdomain' );?></button>
</div>
