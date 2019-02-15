/**
 * Update admin UI buttons status
 *
 * @since    1.1.0
 */
const UpdateAdminUIIconStatus = status => {
	const MenuButton = document.querySelector( '#wp-admin-bar-pt_comingsoonblocks_toolbar_group' );

	if( status ) {
		// Header Menu
		MenuButton.classList.add( '-coming-soon-enabled' );
		MenuButton.querySelector( 'a.ab-item i.dashicons-before' ).classList.remove( 'dashicons-unlock' );
		MenuButton.querySelector( 'a.ab-item i.dashicons-before' ).classList.add( 'dashicons-lock' );

		// Left Menu
		document.querySelector( '#toplevel_page_coming-soon-blocks > a .dashicons-before' ).classList.remove( 'dashicons-unlock' );
		document.querySelector( '#toplevel_page_coming-soon-blocks > a .dashicons-before' ).classList.add( 'dashicons-lock' );
	}
	else {
		// Header Menu
		MenuButton.classList.remove( '-coming-soon-enabled' );
		MenuButton.querySelector( 'a.ab-item i.dashicons-before' ).classList.remove( 'dashicons-lock' );
		MenuButton.querySelector( 'a.ab-item i.dashicons-before' ).classList.add( 'dashicons-unlock' );

		// Left Menu
		document.querySelector( '#toplevel_page_coming-soon-blocks > a .dashicons-before' ).classList.remove( 'dashicons-lock' );
		document.querySelector( '#toplevel_page_coming-soon-blocks > a .dashicons-before' ).classList.add( 'dashicons-unlock' );
	}
};


export default UpdateAdminUIIconStatus;
