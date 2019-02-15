import {PLANS} from '../global-settings';
const USER_LICENSE   = csblocks.license;
/**
 * Merge saved options with default options
 *
 * @since    1.0.0
 */
export function mergeSavedPostMetaOptions( savedOptions, defaultOptions ) {

	if( savedOptions === '' || savedOptions === undefined || savedOptions === false ) {
		return defaultOptions;
	}

	if( typeof savedOptions === 'string' || savedOptions instanceof String ) {
		savedOptions = JSON.parse( savedOptions );
	}

	for( const key in defaultOptions ) {
		if( !savedOptions.hasOwnProperty( key ) ) {
			savedOptions[key] = defaultOptions[key];
		}
	}

	return savedOptions;
}

/**
 * Validate user plan
 *
 * @since    1.0.0
 */
export function validatePlan( plan ) {
	return PLANS[USER_LICENSE.plan] >= PLANS[plan];
}

/**
 * Check if array/object is empty
 *
 * @since    1.0.0
 */
export function isEmpty(input) {
	if (typeof input === 'array') {
		return input.length === 0;
	}

	return !input || Object.keys(input).length === 0;
}