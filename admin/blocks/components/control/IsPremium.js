const { __, sprintf } = wp.i18n;
const USER_LICENSE   = csblocks.license;

/**
 * Component
 *
 * @since    1.0.0
 */
const IsPremium = ( { children } ) => {
	const plan = 'PRO';

	if( USER_LICENSE.is_premium ) {
		return children;
	} else {
		const __msg = sprintf( __( 'This is a %s feature', '@@pkg.textdomain'  ), `<i>PRO</i>` );
		return (
			<span data-component="is-premium">
				<p className="feature-label-notice" dangerouslySetInnerHTML={{ __html: __msg }}></p>
				{children}
			</span>
		);
	}

};

export default IsPremium;
