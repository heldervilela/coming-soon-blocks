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
import MyColorPalette from "../../components/control/ColorPalette";
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
			copyrightTypo: JSON.parse( this.props.attributes.copyrightTypo ),
			logo: JSON.parse( this.props.attributes.logo ),
			overlay: JSON.parse( this.props.attributes.overlay ),
		};

		loadGoogleFont( this.state.titleTypo );
		loadGoogleFont( this.state.bodyTypo );
		loadGoogleFont( this.state.copyrightTypo );

		this.editorCssStylePrint = this.editorCssStylePrint.bind( this );
	}

	/**
	 * Editor css font style print to dom
	 *
	 * @since    1.0.0
	 */
	editorCssStylePrint() {
		const { titleTypo, bodyTypo, copyrightTypo } = this.state;
		const { clientId, attributes: { bodyTextColor, titleTextColor, blockBgColor } } = this.props;

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
		const cssBlock = () => {
			return `div[data-block="${clientId}"] main { color: ${bodyTextColor}; }
					div[data-block="${clientId}"] main h1 { color: ${titleTextColor}; }
					div[data-block="${clientId}"] main .content__wrapper { background-color: ${blockBgColor}; }`;
		};

		return (
			<div id={`block-style--${clientId}`} dangerouslySetInnerHTML={{
				__html: `
				<style>
				${css( titleTypo, 'title__typography' )}
				${css( bodyTypo, 'body__typography' )}
				${css( copyrightTypo, 'copyright__typography' )}
				${cssBlock()}
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
				      addLogo,
				      logoMaxWidth,
				      networks,

				      contentMaxWidth,
				      titleText,
				      descriptionText,
				      copyrightText,

				      titleTextColor,
				      bodyTextColor,
				      blockBgColor,
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

						<ToggleControl
							label={__( 'Add Logo', '@@pkg.textdomain' )}
							checked={addLogo}
							onChange={( value ) => setAttributes( { addLogo: value } )}
						/>

						{
							addLogo && (
								<RangeControl
									label={__( 'Max Logo Width (px)', '@@pkg.textdomain' )}
									value={logoMaxWidth}
									onChange={( value ) => setAttributes( { logoMaxWidth: value } )}
									min={30}
									max={500}
									step={5}
								/>
							)
						}
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
							<TypographySelector title={__( 'Copyright', '@@pkg.textdomain' )}
							                    typography={this.state.copyrightTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    copyrightTypo: newTypo
								                    }) );
								                    setAttributes( { copyrightTypo: JSON.stringify( newTypo ) } );
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

					<div className="the-content -body__typography">


						<div className="intro-text" style={{ maxWidth: `${contentMaxWidth}px` }}>
							{
								addLogo && (
									<div className="page-brand">
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
											allowedMediaTypes={ALLOWED_MEDIA_TYPES}
											style={{ maxWidth: `${logoMaxWidth}px` }}
											align='center'
										/>
									</div>
								)
							}
							<RichText
								tagName="h1"
								value={titleText}
								className="-title__typography"
								placeholder={__( 'Say something to your visits...', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { titleText: value } )}
							/>
							<RichText
								tagName="p"
								value={descriptionText}
								placeholder={__( 'Leave empty to hide.', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { descriptionText: value } )}
							/>
						</div>

						{/* Footer */}
						<div className="the-footer">
							<div className="copy-text">
								<RichText
									tagName="p"
									value={copyrightText}
									className="-copyright__typography"
									placeholder={__( '© 2018...', '@@pkg.textdomain' )}
									onChange={( value ) => setAttributes( { copyrightText: value } )}
								/>
							</div>
							<div className="social-links">
								<SocialIcons networks={networks}
								             setNetworks={( value ) => setAttributes( { networks: value } )}
								             position='top left'
								/>
							</div>
						</div>
					</div>

					<BlockBackgroundOverLayer attrs={this.state.overlay}/>
					<BlockBackground background={background}/>

				</main>

				{
					/**
					 * CSS
					 */
					this.editorCssStylePrint()
				}
			</Fragment>
		);
	}
}

export default Edit;







