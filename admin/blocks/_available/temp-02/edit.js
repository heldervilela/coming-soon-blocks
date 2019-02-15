/**
 * WordPress dependencies
 */
const { __ }                  = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	      RichText,
	      InspectorControls,
	      PanelColorSettings,
      }                       = wp.editor;
const {
	      RangeControl,
	      DropZone,
	      PanelBody,
	      SelectControl,
      }                       = wp.components;

/**
 * Internal dependencies
 */
import {name, ALLOWED_MEDIA_TYPES} from './settings';
import BrandUpload from '../../components/control/BrandUpload.js';
import OverlayerControl from '../../components/control/Overlayer.js';
import BackgroundOptions from '../../components/control/Background.js';
import TypographySelector, { loadGoogleFont } from "../../components/control/TypographySelector";
import { pluginColorPalette } from '../../../../public/_scripts/block-editor/global-settings';
import IsPremium from "../../components/control/IsPremium";
import { BlockBackground, BlockBackgroundOverLayer } from "../../components/BlockBackground";

/**
 * Block edit function
 */
class Edit extends Component {

	constructor( { attributes } ) {
		super( ...arguments );

		this.state = {
			bodyTypo: JSON.parse( this.props.attributes.bodyTypo ),
			logo: JSON.parse( this.props.attributes.logo ),
			overlay: JSON.parse( this.props.attributes.overlay ),
		};

		loadGoogleFont(this.state.bodyTypo);

		this.editorCssStylePrint = this.editorCssStylePrint.bind( this );
	}

	/**
	 * Editor css font style print to dom
	 *
	 * @since    1.0.0
	 */
	editorCssStylePrint() {
		const { bodyTypo } = this.state;
		const { clientId, attributes: { textColor } } = this.props;

		/**
		 * Typography
		 */
		const css = ( _typo, _className ) => {
			let fontStyle = 'normal';
			let fontweight = _typo.desktop.fontweight;

			if( fontweight.includes('italic') ) {
				fontweight = fontweight.replace("italic", ""); // Remove italic
				fontweight = fontweight ? fontweight : 'normal'; // Check if is empty
				fontStyle = 'italic';
			}
			if( fontweight.includes('regular') ){
				fontweight = 'normal';
			}

			return `div[data-block="${clientId}"] main .-${_className} {
						font-family: ${_typo.fontfamily};
						font-size: ${_typo.desktop.fontsize}px;
						font-weight: ${fontweight};
						font-style: ${fontStyle};
						line-height: ${_typo.desktop.lineheight}%;
						letter-spacing: ${_typo.desktop.letterspacing}px;
					}`;
		};

		/**
		 * Text Color
		 */
		const cstextColors = () => {
			return `div[data-block="${clientId}"] main p {
						color: ${textColor};
					}`;
		};

		return (
			<div id={`block-style--${clientId}`} dangerouslySetInnerHTML={{__html: `
				<style>
				${css(bodyTypo, 'body__typography')}
				${cstextColors()}
				</style>
				`}}/>
		);
	}

	/**
	 * Render
	 */
	render() {
		const {
			      attributes: {
				      logo,
				      logoMaxWidth,
				      additionalText,
				      copyrightText,
				      textColor,
				      overlay,
				      background,
			      },
			      className,
			      setAttributes,
		      } = this.props;

		return (
			<Fragment>
				{
					/**
					 * Sidebar Controls
					 */
				}
				<InspectorControls>
					{
						/** Background */
					}
					<PanelBody
						title={ __( 'BACKGROUND', '@@pkg.textdomain'  ) }
						initialOpen={ true }
					>
						<OverlayerControl attrs={overlay} updateAttribute={( _params ) => {
							setAttributes( { overlay: JSON.stringify( _params ) } );
							this.setState( ( state, props ) => ({ ...state, overlay: _params }) );
						}}/>

						<BackgroundOptions attributes={background} updateAttributes={( _param ) => {
							setAttributes( { background: _param } );
						}}/>

					</PanelBody>
					{
						/** Brand */
					}
					<PanelBody
						title={ __( 'BRAND', '@@pkg.textdomain'  ) }
						initialOpen={ false }
					>
						<RangeControl
							label={ __( 'Max Logo Width (px)', '@@pkg.textdomain'  ) }
							value={ logoMaxWidth }
							onChange={  ( value ) => setAttributes({ logoMaxWidth: value }) }
							min={ 30 }
							max={ 500 }
							step={ 5 }
						/>

					</PanelBody>
					{
						/** Typography */
					}
					<PanelColorSettings
						title={ __( 'TYPOGRAPHY', '@@pkg.textdomain'  ) }
						initialOpen={ false }
						colorSettings={ [ {
							value: textColor,
							colors: pluginColorPalette,
							onChange: ( value ) => {
								setAttributes( { textColor: value } );
								console.log( value );
							},
							label: __( 'Text color', '@@pkg.textdomain'  ),
						} ] }
					>
						<IsPremium>
						<label className="single-field-label">{__('Fonts', '@@pkg.textdomain' )}</label>
						<TypographySelector title={__( 'Body', '@@pkg.textdomain'  )}
						                    typography={ this.state.bodyTypo }
						                    updated={( newTypo ) => {
							                    this.setState( ( prevState ) => ({ ...prevState, bodyTypo: newTypo }));
							                    setAttributes( { bodyTypo: JSON.stringify(newTypo) });
						                    }}/>
						</IsPremium>
					</PanelColorSettings>
				</InspectorControls>
				{
					/**
					 * Markup
					 */
				}
				<main data-block={name} className={className}>

						<div className="brand__wrapper">
							<BrandUpload
								onSelect={( media ) => {
									const logo = {
										id: media.id,
										url: media.url,
									};
									this.setState( ( prevState ) => ({ ...prevState, logo: logo }));
									setAttributes( { logo: JSON.stringify(logo) });
								}}
								logoAttrs={ this.state.logo }
								allowedMediaTypes={ALLOWED_MEDIA_TYPES}
								style={{maxWidth: `${logoMaxWidth}px`}}
								align='center'
							/>
							<span className="-body__typography additional-text__wrapper">
							<RichText
								tagName="p"
								value={additionalText}
								placeholder={__( 'Additional text, leave empty if you do not want to use.', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { additionalText: value } )}
							/>
						</span>
						</div>

						<div className="copyright__wrapper">
							<RichText
								tagName="p"
								value={ copyrightText }
								className="-body__typography"
								placeholder={ __('Copyright', '@@pkg.textdomain' ) }
								onChange={  ( value ) => setAttributes({ copyrightText: value }) }
							/>
						</div>

					<BlockBackgroundOverLayer attrs={ this.state.overlay } />
					<BlockBackground background={background} />

				</main>

				{
					/**
					 * CSS
					 */
				}
				{ this.editorCssStylePrint() }

			</Fragment>
		);
	}
}

export default Edit;
