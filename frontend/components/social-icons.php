<?php
/**
 * Social widget component.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */
if( empty($networks)) {
	return;
}

$networks = json_decode( $networks );
?>
<div data-component="social-icons">
	<?php
		foreach( $networks as $network ):
			if( ! empty($network->url) ):
	?>
			<a href="<?php echo esc_url($network->url); ?>" target="_blank" class="-icon -<?php echo esc_attr($network->icon); ?>"><i class="socicon-<?php echo esc_attr($network->icon); ?>"></i></a>
	<?php
			endif;
		endforeach;
	?>
</div>
