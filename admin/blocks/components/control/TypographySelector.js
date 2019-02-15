/**
 * WordPress dependencies
 */
const { __ }                  = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	      Button,
	      Dropdown,
	      RangeControl,
	      SelectControl
      }                       = wp.components;

/**
 * Internal dependencies
 */
import FontPicker from './FontPicker';
import SVG_DESKTOP from '../../../../public/svg/responsive--desktop.svg'
import SVG_MOBILE from '../../../../public/svg/responsive--mobile.svg'

/**
 * Config
 */
import {GOOGLE_API_KEY} from '../../../../public/_scripts/block-editor/global-settings';
import { validatePlan } from '../../../../public/_scripts/block-editor/utils/tools.js';

/**
 * Help Functions
 *
 * @since    1.0.0
 */
const variantsNames = {
	'100': __( 'Thin' ),
	'200': __( 'Extra-Light' ),
	'200italic': __( 'Extra-Light Italic' ),
	'300': __( 'Light' ),
	'300italic': __( 'Light Italic' ),
	'400': __( 'Regular' ),
	'regular': __( 'Regular' ),
	'italic': __( 'Regular Italic' ),
	'500': __( 'Medium' ),
	'500italic': __( 'Medium Italic' ),
	'600': __( 'Semi-Bold' ),
	'600italic': __( 'Semi-Bold Italic' ),
	'700': __( 'Bold' ),
	'700italic': __( 'Bold Italic' ),
	'800': __( 'Extra-Bold' ),
	'800italic': __( 'Extra-Bold Italic' ),
	'900': __( 'Black' ),
	'900italic': __( 'Black Italic' ),
};

/**
 * Font load function
 *
 * @since    1.0.0
 */
// Generate the URL to the Google Fonts stylesheet of the specified font
function getDownloadURL( font, variants, onlyCharacters ) {
	// Base URL
	let url = 'https://fonts.googleapis.com/css?family='; // Font name
	url += font.replace( / /g, '+' ); // Font variants
	url += ":".concat( variants[0] );

	for( let i = 1; i < variants.length; i += 1 ) {
		url += ",".concat( variants[i] );
	} // Only download characters in the font name if onlyCharacters is true

	if( onlyCharacters === true ) {
		// Remove spaces and duplicate letters from the font name
		let downloadChars = font;
		downloadChars     = downloadChars.replace( /\s+/g, '' );
		downloadChars     = downloadChars.split( '' ).filter( function( x, n, s ) {
			return s.indexOf( x ) === n;
		} ).join( '' );
		url += "&text=".concat( downloadChars );
	}

	return url;
}
// Add link tag to header
export function loadGoogleFont( typography ) {
	const fontSelector = typography.fontfamily;
	const fontweight   = typography.desktop.fontweight;
	const url          = getDownloadURL( fontSelector, [fontweight], false ); // Add the stylesheet to the document head

	// Load Google Font
	const link = document.createElement( 'link' );
	link.rel   = 'stylesheet';
	link.href  = url;
	link.id    = "font-full-".concat( fontSelector );

	const fontLinkTag = document.getElementById(link.id);
	if( fontLinkTag ) {
		if( ! fontLinkTag.href.includes( typography.desktop.fontweight ) ){
			fontLinkTag.href = fontLinkTag.href + ',' + typography.desktop.fontweight;
		}
	} else {
		document.head.appendChild( link );
	}

	// console.log( `#Font "${fontSelector} / ${fontweight}" loaded.` );

}

/**
 * Main Component
 *
 * @since    1.0.0
 */
export default class TypographySelector extends Component {
	constructor( { attributes } ) {
		super( ...arguments );

		this.state = {
			tab: 'desktop',
			typography: this.props.typography
		};

		this.updateParam     = this.updateParam.bind( this );
		this.getVariantsList = this.getVariantsList.bind( this );

	}

	/**
	 * Get variants list
	 */
	getVariantsList( _list ) {
		let variants = [];

		variants = Object.keys( _list ).map( ( key, index ) => {
			return {
				label: variantsNames.hasOwnProperty( _list[key] ) ? variantsNames[_list[key]] : _list[key],
				value: _list[key]
			}
		} );

		return variants;
	};

	/**
	 * Update Param
	 */
	updateParam( _value, _param, _media ) {

		const { typography } = this.state;
		const { updated }    = this.props;
		let newState         = typography;

		// Desktop
		if( _media === 'desktop' ) {
			switch( _param ) {
				case 'fontsize':
				case 'lineheight':
				case 'letterspacing':
				case 'fontweight':
					newState.desktop[_param] = _value;
					break;
			}
		}
		// Mobile
		else if( _media === 'mobile' ) {
			switch( _param ) {
				case 'fontsize':
				case 'lineheight':
				case 'letterspacing':
				case 'fontweight':
					newState.mobile[_param] = _value;
					break;
			}
		}
		// Others
		else {
			switch( _param ) {
				case 'fontfamily':
					newState.fontfamily         = _value.family;
					newState.variants           = _value.variants;
					newState.desktop.fontweight = _value.variants[0];
					newState.mobile.fontweight  = _value.variants[0];
					break;
			}
		}

		updated( newState );
		this.setState( ( prevState ) => ({ ...prevState, typography: newState }) );
		loadGoogleFont(newState);
	}

	/**
	 * View
	 */
	render() {
		const { typography, tab } = this.state;
		const { title }           = this.props;
		const previewStyle        = {
			fontFamily: typography.fontfamily,
			fontWeight: typography.desktop.fontweight
		};

		return (

			<Dropdown
				className="editor-component--field-typography-selector"
				contentClassName="editor-component--dropdown-typography-selector"
				position="bottom right"
				renderToggle={( { isOpen, onToggle } ) => (
					<Button onClick={onToggle} aria-expanded={isOpen}>
						<label>{title}</label>
						<p style={previewStyle}>{typography.fontfamily}</p>
					</Button>

				)}
				renderContent={() => (
					<Fragment>
						<FontPicker
							apiKey={GOOGLE_API_KEY}
							activeFont={typography.fontfamily}
							onChange={( selectedFont ) => this.updateParam( selectedFont, 'fontfamily', 'global' )}
						/>
						<div className="typography-options__wrapper">
							<div className="tabs-menu">
								<button data-mode={tab === 'desktop' ? 'active' : ''}
								        onClick={( value ) => this.setState( ( prevState ) => ({
									        ...prevState,
									        tab: 'desktop'
								        }) )}
								>
									<SVG_DESKTOP/>
								</button>
								<button data-mode={tab === 'mobile' ? 'active' : ''}
								        onClick={( value ) => this.setState( ( prevState ) => ({
									        ...prevState,
									        tab: 'mobile'
								        }) )}>
									<SVG_MOBILE/>
								</button>
							</div>
							<div className="tabs-content">
								{tab === 'desktop' && (
									<div className="tab--desktop">
										<RangeControl
											label={__( 'Size (px)' )}
											value={typography.desktop.fontsize}
											onChange={( value ) => this.updateParam( value, 'fontsize', 'desktop' )}
											min={12}
											max={100}
										/>
										<SelectControl
											label={__( 'Style' )}
											value={typography.desktop.fontweight}
											options={this.getVariantsList( typography.variants )}
											onChange={( value ) => this.updateParam( value, 'fontweight', 'desktop' )}
										/>
										<RangeControl
											label={__( 'Line Height (%)' )}
											value={typography.desktop.lineheight}
											onChange={( value ) => this.updateParam( value, 'lineheight', 'desktop' )}
											min={100}
											max={200}
											step={5}
										/>
										<RangeControl
											label={__( 'Letter Spacing (px)' )}
											value={typography.desktop.letterspacing}
											onChange={( value ) => this.updateParam( value, 'letterspacing', 'desktop' )}
											min={-1}
											max={5}
											step={0.1}
										/>
									</div>
								)}
								{tab === 'mobile' && (
									<div className="tab--mobile">
										<RangeControl
											label={__( 'Size (px)' )}
											value={typography.mobile.fontsize}
											onChange={( value ) => this.updateParam( value, 'fontsize', 'mobile' )}
											min={12}
											max={50}
										/>
										<SelectControl
											label={__( 'Style' )}
											value={typography.mobile.fontweight}
											options={this.getVariantsList( typography.variants )}
											onChange={( value ) => this.updateParam( value, 'fontweight', 'mobile' )}
										/>
										<RangeControl
											label={__( 'Line Height (%)' )}
											value={typography.mobile.lineheight}
											onChange={( value ) => this.updateParam( value, 'lineheight', 'mobile' )}
											min={100}
											max={200}
											step={5}
										/>
										<RangeControl
											label={__( 'Letter Spacing (px)' )}
											value={typography.mobile.letterspacing}
											onChange={( value ) => this.updateParam( value, 'letterspacing', 'mobile' )}
											min={-1}
											max={5}
											step={0.1}
										/>
									</div>
								)}
							</div>

						</div>
					</Fragment>
				)}
			/>
		)
	}
}
