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
	      PanelBody,
	      ToggleControl
      }                       = wp.components;

/**
 * Internal dependencies
 */
import {name, ALLOWED_MEDIA_TYPES} from './settings';
import BrandUpload from '../../components/control/BrandUpload.js';
import OverlayerControl from '../../components/control/Overlayer.js';
import BackgroundOptions from '../../components/control/Background.js';
import TypographySelector, {loadGoogleFont} from "../../components/control/TypographySelector";
import {pluginColorPalette} from '../../../../public/_scripts/block-editor/global-settings';
import IsPremium from "../../components/control/IsPremium";
import {BlockBackground, BlockBackgroundOverLayer} from "../../components/BlockBackground";
import SocialIcons from '../../components/SocialIcons';

/**
 * Block edit function
 */
class Edit extends Component {

	constructor( { attributes } ) {
		super( ...arguments );

		this.state = {
			titleTypo: JSON.parse( this.props.attributes.titleTypo ),
			bodyTypo: JSON.parse( this.props.attributes.bodyTypo ),
			logo: JSON.parse( this.props.attributes.logo ),
			overlay: JSON.parse( this.props.attributes.overlay ),
		};

		loadGoogleFont( this.state.titleTypo );
		loadGoogleFont( this.state.bodyTypo );
	}

	/**
	 * Editor css font style print to dom
	 *
	 * @since    1.0.0
	 */
	editorCssStylePrint = () => {
		const { titleTypo, bodyTypo }   = this.state;
		const { clientId, attributes: { bodyTextColor, titleTextColor } } = this.props;

		/**
		 * Typography
		 */
		const css = ( _typo, _className ) => {
			let fontStyle  = 'normal';
			let fontweight = _typo.desktop.fontweight;

			if( fontweight.includes( 'italic' ) ) {
				fontweight = fontweight.replace( "italic", "" ); // Remove italic
				fontweight = fontweight ? fontweight : 'normal'; // Check if is empty
				fontStyle  = 'italic';
			}
			if( fontweight.includes( 'regular' ) ) {
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
		 * Colors
		 */
		const csbodyTextColors = () => {
			return `div[data-block="${clientId}"] main { color: ${bodyTextColor}; }
					div[data-block="${clientId}"] main h1 { color: ${titleTextColor}; }`;
		};

		return (
			<div id={`block-style--${clientId}`} dangerouslySetInnerHTML={{
				__html: `
				<style>
				${css( titleTypo, 'title__typography' )}
				${css( bodyTypo, 'body__typography' )}
				${csbodyTextColors()}
				</style>
				`
			}}/>
		);
	}

	/**
	 * Render
	 */
	render() {
		const {
			      attributes: {
				      logoMaxWidth,
				      logoWithMask,
				      networks,

				      contentMaxWidth,
				      titleText,
				      subtitleText,
				      copyrightText,

				      titleTextColor,
				      bodyTextColor,
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
						title={__( 'BACKGROUND', '@@pkg.textdomain' )}
						initialOpen={true}
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
						title={__( 'BRAND', '@@pkg.textdomain' )}
						initialOpen={false}
					>
						<RangeControl
							label={__( 'Max Logo Width (px)', '@@pkg.textdomain' )}
							value={logoMaxWidth}
							onChange={( value ) => setAttributes( { logoMaxWidth: value } )}
							min={30}
							max={500}
							step={5}
						/>
						<ToggleControl
							checked={ logoWithMask }
							label={__( 'Image with mask ', '@@pkg.textdomain' )}
							onChange={ (value) => setAttributes( { logoWithMask: value } )}
						/>
					</PanelBody>
					{
						/** Typography */
					}
					<PanelColorSettings
						title={__( 'TYPOGRAPHY', '@@pkg.textdomain' )}
						initialOpen={false}
						colorSettings={[
							{
								value: titleTextColor,
								colors: pluginColorPalette,
								onChange: ( value ) => {
									setAttributes( { titleTextColor: value } );
									console.log( value );
								},
								label: __( 'Title color', '@@pkg.textdomain' ),
							},
							{
								value: bodyTextColor,
								colors: pluginColorPalette,
								onChange: ( value ) => {
									setAttributes( { bodyTextColor: value } );
									console.log( value );
								},
								label: __( 'Text color', '@@pkg.textdomain' ),
							}
						]}
					>
						<RangeControl
							label={__( 'Max Content Width (px)', '@@pkg.textdomain' )}
							value={contentMaxWidth}
							onChange={( value ) => setAttributes( { contentMaxWidth: value } )}
							min={100}
							max={1200}
							step={5}
						/>

						<IsPremium>
							<label className="single-field-label">{__( 'Fonts', '@@pkg.textdomain' )}</label>
							<TypographySelector title={__( 'Title', '@@pkg.textdomain' )}
							                    typography={this.state.titleTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    titleTypo: newTypo
								                    }) );
								                    setAttributes( { titleTypo: JSON.stringify( newTypo ) } );
							                    }}/>
							<TypographySelector title={__( 'Body', '@@pkg.textdomain' )}
							                    typography={this.state.bodyTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    bodyTypo: newTypo
								                    }) );
								                    setAttributes( { bodyTypo: JSON.stringify( newTypo ) } );
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
					<div className="top-content__wrapper"></div>

					{/* Middle */}
					<div className="middle-content__wrapper">
						<div style={{maxWidth:`${contentMaxWidth}px`}}>
							<BrandUpload
								onSelect={( media ) => {
									const logo = {
										id: media.id,
										url: media.url,
									};
									this.setState( ( prevState ) => ({ ...prevState, logo: logo }) );
									setAttributes( { logo: JSON.stringify( logo ) } );
								}}
								logoAttrs={this.state.logo}
								logoWithMask={ logoWithMask }
								allowedMediaTypes={ALLOWED_MEDIA_TYPES}
								style={{ maxWidth: `${logoMaxWidth}px` }}
								align='center'
							/>

							<RichText
								tagName="h1"
								value={titleText}
								className="-title__typography"
								placeholder={__( 'Say something about the page ...', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { titleText: value } )}
							/>
							<RichText
								tagName="p"
								value={subtitleText}
								className="-body__typography"
								placeholder={__( 'Leave empty if you do not want to use.', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { subtitleText: value } )}
							/>
							<div className="social__wrapper">
								<SocialIcons networks={networks}
								             setNetworks={( value ) => setAttributes( { networks: value } )}
								             position='top left'
								/>
							</div>
						</div>
					</div>

					{/* Bottom */}
					<div className="bottom-content__wrapper -body__typography">
						<RichText
							tagName="p"
							value={copyrightText}
							className="-body__typography copyright_wrapper"
							placeholder={__( '© 2018...', '@@pkg.textdomain' )}
							onChange={( value ) => setAttributes( { copyrightText: value } )}
						/>
					</div>

					<BlockBackgroundOverLayer attrs={this.state.overlay}/>
					<BlockBackground background={background}/>

				</main>
				{
					/**
					 * CSS
					 */
				}
				{this.editorCssStylePrint()}

			</Fragment>
		);
	}
}

export default Edit;
