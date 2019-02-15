
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
			subtitleTypo: JSON.parse( this.props.attributes.subtitleTypo ),
			bodyTypo: JSON.parse( this.props.attributes.bodyTypo ),
			logo: JSON.parse( this.props.attributes.logo ),
			overlay: JSON.parse( this.props.attributes.overlay ),
		};

		loadGoogleFont( this.state.titleTypo );
		loadGoogleFont( this.state.subtitleTypo );
		loadGoogleFont( this.state.bodyTypo );

		this.editorCssStylePrint = this.editorCssStylePrint.bind( this );
	}

	/**
	 * Editor css font style print to dom
	 *
	 * @since    1.0.0
	 */
	editorCssStylePrint() {
		const { titleTypo, subtitleTypo, bodyTypo }   = this.state;
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
					div[data-block="${clientId}"] main h2 { color: ${titleTextColor}; }
					div[data-block="${clientId}"] main .content__wrapper { background-color: ${blockBgColor}; }`;
		};

		return (
			<div id={`block-style--${clientId}`} dangerouslySetInnerHTML={{
				__html: `
				<style>
				${css( titleTypo, 'title__typography' )}
				${css( subtitleTypo, 'subtitle__typography' )}
				${css( bodyTypo, 'body__typography' )}
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
				      logoMaxWidth,
				      networks,

				      contentMaxWidth,
				      titleText,
				      subtitleText,
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
						<MyColorPalette label={ __( 'Background Block Color', '@@pkg.textdomain') }
						                colorValue={ blockBgColor }
						                onChange={ ( value ) => setAttributes( { blockBgColor: value } ) }
						/>

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
							<TypographySelector title={__( 'Subtitle', '@@pkg.textdomain' )}
							                    typography={this.state.subtitleTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    subtitleTypo: newTypo
								                    }) );
								                    setAttributes( { subtitleTypo: JSON.stringify( newTypo ) } );
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

					{/* Left */}
					<div className="media__wrapper">
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

					{/* Right */}
					<div className="content__wrapper -body__typography">
						{/* Middle */}
						<div className="the-content" style={{ maxWidth: `${contentMaxWidth}px` }}>
							<RichText
								tagName="h2"
								value={subtitleText}
								className="-subtitle__typography"
								placeholder={__( 'Leave empty to hide.', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { subtitleText: value } )}
							/>
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
							<SocialIcons networks={networks}
							             setNetworks={( value ) => setAttributes( { networks: value } )}
							             position='top left'
							/>
						</div>

						{/* Footer */}
						<div className="the-footer">
							<RichText
								tagName="p"
								value={copyrightText}
								placeholder={__( '© 2018...', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { copyrightText: value } )}/>
						</div>
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
