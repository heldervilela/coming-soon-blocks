<?php
/**
 * plugin config file.
 *
 * @package   @@pkg.title
 * @author    @@pkg.author
 * @link      @@pkg.author_uri
 * @license   @@pkg.license
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Pixelthrone\ComingSoon_Blocks\Plugin;

$icon = Plugin::is_active() ? 'dashicons-lock' : 'dashicons-unlock';
$cdnURL = 'https://cdn.pixelthrone.com/';

$configArray = [
	/**
	 * Plugin.
	 */
	'plugin'    => [
		'slug'      => 'coming-soon-blocks',
		'name'      => 'Coming Soon Blocks',
		'version'   => '1.3.0',
		'PluginURI' => 'https://pixelthrone.com/coming-soon-blocks',
		'wp_org_url' => 'https://wordpress.org/support/plugin/coming-soon-blocks',
		'wp_review_url' => 'https://wordpress.org/support/plugin/coming-soon-blocks/reviews/',
	],
	/**
	 * Meta keys.
	 */
	'meta_keys' => [
		'seo'              => 'comingsoonblocks_seo',
		'settings'         => 'comingsoonblocks_settings',
		'lookandfeel'      => 'comingsoonblocks_lookandfeel',
		'selected_page_id' => 'comingsoonblocks_selected_page_id',
	],
	/**
	 * Cdn.
	 */
	'cdn'    => [
		'media' => $cdnURL.'media/coming-soon-blocks/',
		'notices' => $cdnURL.'notices/coming-soon-blocks/',
	],
	/**
	 * 3rd-Party plugins.
	 */
	'3party'    => [
		'gutenberg' => [
			'slug' => 'gutenberg',
			'name' => 'gutenberg',
			'base' => 'gutenberg/gutenberg.php',
		]
	],
	/**
	 * Admin Menu.
	 */
	'admin_button' => [
		'page_title' => esc_html__( 'Coming Soon', '@@pkg.textdomain' ),
		'menu_title' => esc_html__( 'Coming Soon', '@@pkg.textdomain' ),
		'capability' => 'manage_options',
		'menu_slug' => '',
		'function' => '',
		'icon_url' => $icon,
		'position' => 22,
	],
	/**
	 * Post Type.
	 */
	'post_type' => [
		'menu_icon'           => $icon,
		'label'               => esc_html__( 'Coming Soon', '@@pkg.textdomain' ),
		'labels'              => [
			'name'               => esc_html__( 'Coming Soon', '@@pkg.textdomain' ),
			'singular_name'      => esc_html__( 'Page', '@@pkg.textdomain' ),
			'menu_name'          => esc_html__( 'Coming Soon', '@@pkg.textdomain' ),
			'parent_item_colon'  => esc_html__( 'Page', '@@pkg.textdomain' ),
			'all_items'          => esc_html__( 'All Pages', '@@pkg.textdomain' ),
			'view_item'          => esc_html__( 'View Pages', '@@pkg.textdomain' ),
			'add_new_item'       => esc_html__( 'Add new', '@@pkg.textdomain' ),
			'add_new'            => esc_html__( 'Add new', '@@pkg.textdomain' ),
			'edit_item'          => esc_html__( 'Edit Pages', '@@pkg.textdomain' ),
			'update_item'        => esc_html__( 'Update', '@@pkg.textdomain' ),
			'search_items'       => esc_html__( 'Search pages', '@@pkg.textdomain' ),
			'not_found'          => esc_html__( 'No pages found', '@@pkg.textdomain' ),
			'not_found_in_trash' => esc_html__( 'No pages found in Trash', '@@pkg.textdomain' ),
		],
		'supports'            => [ 'title', 'revisions', 'editor' ],
		'hierarchical'        => true,
		'public'              => true,
		'show_ui'             => true,
		'show_in_nav_menus'   => false,
		'show_in_admin_bar'   => true,
		'menu_position'       => false,
		'can_export'          => true,
		'has_archive'         => true,
		'show_in_rest'        => true,
		'exclude_from_search' => true,
		'publicly_queryable'  => true,
		'capability_type'     => 'page',
		'show_in_menu' => 'coming-soon-blocks'
	],
	/**
	 * toolbar.
	 */
	'toolbar'   => [
		[
			'id'    => 'pt_comingsoonblocks_toolbar_group',
			'title' => '<i class="dashicons-before '.$icon.'"></i>',
			'href'  => get_admin_url( null, 'edit.php?post_type=coming-soon-blocks' ),
			'meta'  => [ 'class' => '' ],
			'parent' => 'top-secondary',
		],
		[
			'id'     => 'pt_comingsoonblocks_toolbar_add-new',
			'title'  => sprintf( esc_html__( '%s Add Coming soon', '@@pkg.textdomain' ), '<i class="dashicons-before dashicons-plus"></i>' ),
			'href'   => get_admin_url( null, 'post-new.php?post_type=coming-soon-blocks' ),
			'parent' => 'pt_comingsoonblocks_toolbar_group'
		],
		[
			'id'     => 'pt_comingsoonblocks_toolbar_settings',
			'title'  => sprintf( esc_html__( '%s Settings', '@@pkg.textdomain' ), '<i class="dashicons-before dashicons-admin-generic"></i>' ),
			'href'   => get_admin_url( null, 'edit.php?post_type=coming-soon-blocks' ),
			'parent' => 'pt_comingsoonblocks_toolbar_group'
		],
	]
];

if( ! csblocks_fs()->is_network_active() || csblocks_fs()->is_delegated_connection() ) {
	$configArray['toolbar'][] = [
		'id'     => 'pt_comingsoonblocks_toolbar_contact-us',
		'title'  => esc_html__( 'Contact Us', '@@pkg.textdomain' ),
		'href'   => csblocks_fs()->contact_url(),
		'parent' => 'pt_comingsoonblocks_toolbar_group',
	];
	$configArray['toolbar'][] = [
		'id'     => 'pt_comingsoonblocks_toolbar_support-forum',
		'title'  => esc_html__( 'Support Forum', '@@pkg.textdomain' ),
		'href'   => csblocks_fs()->get_support_forum_url(),
		'parent' => 'pt_comingsoonblocks_toolbar_group',
		'meta'  => [ 'target' => '_blank' ]
	];
	$configArray['toolbar'][] = [
		'id'     => 'pt_comingsoonblocks_toolbar_upgrade',
		'title'  => csblocks_fs()->is_free_plan() ? esc_html__( 'Upgrade', '@@pkg.textdomain' ) : esc_html__( 'Pricing', '@@pkg.textdomain' ),
		'href'   => csblocks_fs()->pricing_url(),
		'parent' => 'pt_comingsoonblocks_toolbar_group',
	];
}


return $configArray;
